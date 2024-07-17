import CheckboxField from "./fields/CheckboxRender";
import SelectField from "./fields/SelectRender";
import DisplayField from "./fields/DisplayRender";
import FileField from "./fields/FileRender";
import ImageField from "./fields/ImageRender";
import VideoField from "./fields/VideoRender";
import NumberField from "./fields/NumberRender";
import PurchaseField from "./fields/PurchaseRender";
import SignatureField from "./fields/SignatureRender";
import StripeField from "./fields/StripeRender";
import TextAreaField from "./fields/TextAreaRender";
import TextField from "./fields/TextRender";
import TimeStampField from "./fields/TimeStampRender";
import CaptchaField from "./fields/CaptchaRender";
import DateRangeField from "./fields/DateRangeRender";
import QueueField from "./fields/QueueRender";
import { SourceField, SourceRenderToObject } from "./fields/SourceRender";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Transform a rendered form to a single object of name/value pairs
export function FormRenderToObject(data, endKey, inheritState, initState)
{
    var object = {};
    var sources = [];
    var source_count = 0;
    const trimmedForm = FormRemoveSeparators(data, endKey);

//    console.log("initState: " + JSON.stringify(initState));

    trimmedForm.forEach(function(value, key)
    {
      // The value of the queue is the name, so populate with rendered object
      //   queue_start is incrementing integer to support nested sources
      if (key === "formally_source_start")
      {
        sources[source_count] = value;
        source_count++;
//        console.log(value);
//        if (initState && initState[value])
//          console.log("initSourceState: " + JSON.stringify(initState[value]["data"]));
//        else if (inheritState && inheritState[value])
//          console.log("inheritSourceState: " + JSON.stringify(inheritState[value]["data"]));
        object[value] = {};
        object[value]["data"] = SourceRenderToObject(trimmedForm, value,
            inheritState && inheritState[value] ? inheritState[value]["data"] : null,
            initState && initState[value] ? initState[value]["data"] : null);
//        console.log("After SourceRenderToObject " + JSON.stringify(object[value]["data"]));
      }
      else if (source_count > 0)
      {
        if (key === "formally_source_end")
        {
          source_count--;
          if (object[sources[source_count]])
            object[sources[source_count]]["form"] = JSON.parse(value);
        }

        // Otherwise ignore fields captured in SourceRenderToObject
      }
      else if (value instanceof File)
      {
        // If inherit/init then this is an edit
        // Replace the original file name back if not a new file uploaded
        if (((inheritState != null) || (initState != null)) && (value.name == ""))
        {
          if ((inheritState != null) && inheritState[key])
            object[key] = inheritState[key];
          else if ((initState != null) && initState[key])
            object[key] = initState[key];
        }
        else
          object[key] = (object[key] ? object[key] + ',' : "") + value.name;
      }
      else
        object[key] = value;
    });
	return object;
}

// Remove field seperators and other extra fields from a form
export function FormRemoveSeparators(data, endKey)
{
    var lastKey = "";
    var newData = new FormData();

    data.forEach(function(value, key)
    {
	    if (key !== endKey)
      {
        // If hidden file input, remove it (captcha and file)
        if (key.includes("captcha-response"))
          console.log("  skip captcha key " + key);
        else if (lastKey + "File" === key)
          console.log("  skip file key " + key);
        else if (lastKey === key + "File")
        {
          console.log("  skip file key " + lastKey);
          newData.delete(lastKey);
        }
        else
          newData.append(key, value);
        lastKey = key;
      }

      // Otherwise it is a separator, so delete
//      else
//        data.delete(key);
    });

	return newData;
}

// Remove formally headers and field seperators from a form
export function FormRemoveSeparatorsAndHeader(data)
{
    // Delete the form header fields
    data.delete("formally_name");
    data.delete("formally_version");
    data.delete("formally_username");

    return FormRemoveSeparators(data, "formally_separator_3210");
}

// Render a form from name and fields definitions
//   with submit callback, logo, submit string, style and state options
export const FormRender = ({nameObj, renderFields, handleSubmitFunction,
                            logo, submitString, style, state}) =>
{
//  const [changedFields, setChangedFields] = useState([]);
//  console.log("FormRender:" + JSON.stringify(state));

/*
  if (state)
  {
    console.log("inheritState " + JSON.stringify(state.inheritState));
    console.log("initState " + JSON.stringify(state.initState));
  }
*/

  return (
    <div>
      <form onSubmit={handleSubmitFunction} style={style.form}>
        <div align="center">
         <h2 style={style.title}>
           <div style={{display:'inline-block', width: '35%'}} align='center'>
             { logo ? <img src={logo} alt="logo" width="100px" /> : "" }
           </div>
           <div style={{display:'inline-block', width: '65%'}} align="left">
             <br />
             {nameObj.name}
           </div>
         </h2>
        </div>
        <input 
          type="text"
          placeholder="Form Name"
          name="formally_name"
          defaultValue={nameObj.name}
          hidden
          readOnly
        />
        <hr/>
        <input 
          type="text"
          name="formally_version"
          defaultValue={nameObj.version}
          hidden
          readOnly
        />
        <input 
          type="text"
          name="formally_username"
          defaultValue={nameObj.username}
          hidden
          readOnly
        />
        {renderFields?.map((field, index) => ( 
          <div key={index} align='center'>
            <div style={style.span ? style.span : {display:'inline-block', width: '20%'}} align='right'>
              <label style={style.labels} htmlFor={field.name}>{field.name ? capitalizeFirstLetter(field.name).replaceAll("_", " ") : ""}:&nbsp;</label>
            </div>
            <div style={{display:'inline-block', width: '80%'}} align='left'>
              {
                field.type === 'display' ?
                  <DisplayField params={{field, style, state}} />
                :
                field.type === 'stripe' ?
                  <StripeField params={{field, style, state }} />
                :
                field.type === 'timestamp' ?
                  <TimeStampField params={{field, style, state}} />
                :
                field.type === 'purchase' ?
                  <PurchaseField params={{field, style, state}} />
                :
                field.type === 'signature' ?
                  <SignatureField params={{field, style, state}} />
                :
                (field.type.startsWith('file')) ?
                  <FileField params={{field, style, state}} />
                :
                (field.type === 'image') ?
                  <ImageField params={{field, style, state}} />
                :
                (field.type === 'video') ?
                  <VideoField params={{field, style, state}} />
                :
                field.type === 'checkbox' ?
                  <CheckboxField params={{field, style, state}} />
                :
                field.type === 'select' ?
                  <SelectField params={{field, style, state}} />
                :
                field.type === 'textarea' ?
                  <TextAreaField params={{field, style, state}} />
                :
                field.type === 'captcha' ?
                  <CaptchaField params={{field, style, state}} />
                :
                field.type === 'daterange' ?
                  <DateRangeField params={{field, style, state}} />
                :
                field.type === 'queue' ?
                  <QueueField params={{field, style, state}} />
                :
                field.type === 'source' ?
                  <SourceField params={{field, style, state}} />
                :
                ((field.type === 'number') || field.type.startsWith('date') ||
                 ( field.type === 'tel')) ?
                  <NumberField params={{field, style, state}} />
                :
                ((field.type === 'text') || (field.type === 'password') ||
                 (field.type === 'email') || (field.type === 'url')) ?
                  <TextField params={{field, style, state}} />
                :
                  "Unsupported type " + field.type
              }
              <input 
                type="text"
                name="formally_separator_3210"
                defaultValue="separator"
                readOnly
                hidden 
              />
            </div>
          </div> 
        ))}
        <div align="center">
          <button title={submitString} type="submit">
            &nbsp;&nbsp;
            <img alt="submit" src={process.env.REACT_APP_URL + "/upload.svg"} width="20px"></img>
              &nbsp;&nbsp;
            {submitString}
              &nbsp;&nbsp;
          </button>
        </div>
      </form>
    </div>
    );
}

export const FormRenderJsonURI = ({formJsonURI, handleSubmitFunction,
                                   logo, submitString, style}) =>
{
  const formObj = fetch(formJsonURI).then(response => response.json());

  return (<FormRender nameObj={formObj.formally} renderFields={formObj.form}
                      handleSubmitFunction={handleSubmitFunction} logo={logo}
                      submitString={submitString} style={style} />);

}

