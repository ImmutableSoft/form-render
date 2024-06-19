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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function FormRenderToObject(data, endKey)
{
    var object = {};
    const trimmedForm = FormRemoveSeparators(data, endKey);//{};

    trimmedForm.forEach(function(value, key)
    {
      if (value instanceof File)
        object[key] = (object[key] ? object[key] + ',' : "") + value.name;
      else
        object[key] = value;
    });
	return object;
}

export function FormRemoveSeparators(data, endKey)
{
    var lastKey = "";

    data.forEach(function(value, key)
    {
	    if (key !== endKey)
      {
//        console.log("key " + key + ", lastKey " + lastKey);
        // If hidden file input, remove it (data URL already encoded)
        if (lastKey === key + "File")
        {
          data.delete(lastKey)
        }
        else if (lastKey + "File" === key)
        {
          data.delete(key);
        }
        lastKey = key;
      }

      // Otherwise it is a separator, so delete
      else
        data.delete(key);
    });

	return data;
}

export function FormRemoveSeparatorsAndHeader(data)
{
    // Delete the form header fields
    data.delete("formally_name");
    data.delete("formally_version");
    data.delete("formally_username");

    return FormRemoveSeparators(data, "formally_separator_3210");
}

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
