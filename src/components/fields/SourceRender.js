import CheckboxField from "./CheckboxRender";
import SelectField from "./SelectRender";
import DisplayField from "./DisplayRender";
import FileField from "./FileRender";
import ImageField from "./ImageRender";
import VideoField from "./VideoRender";
import NumberField from "./NumberRender";
import PurchaseField from "./PurchaseRender";
import SignatureField from "./SignatureRender";
import StripeField from "./StripeRender";
import TextAreaField from "./TextAreaRender";
import TextField from "./TextRender";
import TimeStampField from "./TimeStampRender";
import CaptchaField from "./CaptchaRender";
import DateRangeField from "./DateRangeRender";
import QueueField from "./QueueRender";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Transform a rendered queue source to a single object
export function SourceRenderToObject(trimmedForm, name, inheritState,
                                     initState)
{
    var object = {};
    var source_start = false;
//    console.log("SourceRenderToObject looking for " + name);

    trimmedForm.forEach(function(value, key)
    {
      // If the source is active, add the name/value to the object
      if (source_start)
      {
        // If the end of the source, return the object
        if (key === "formally_source_end")
        {
          console.log("SourceRenderObject returning " + JSON.stringify(object));
          source_start = false;
          return;
        }

        // Otherwise add the fields as part of this source
        if (value instanceof File)
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
      }

      // Otherwise check to see if this is the start of the source
      else if ((key === "formally_source_start") && (value === name))
        source_start = true;
    });
  if (source_start == false)
    return object;
  else
    return {};
}

const SourceRender = ({name, value, style, state}) =>
{
//  const [changedFields, setChangedFields] = useState([]);
//  console.log("FormRender:" + JSON.stringify(state));

  const renderFields = value.form;

  return (
    <div>
        <input 
          type="text"
          name="formally_source_start"
          defaultValue={name}
          readOnly
          hidden 
        />
        {renderFields?.map((field, index) => ( 
          field.type !== 'queue' ?
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
        :
            ""
        ))}
        <input 
          type="text"
          name="formally_source_end"
          defaultValue={JSON.stringify(value)}
          readOnly
          hidden 
        />
      </div>
    );
}

// Render Source field
//  a Source field contains the external form and data
//  that was submitted to this Queue.
//  A form with a Source field is considered a Queue,
//  or Queue capable.
//    Options are Required, Optional, as well as Private, Public.
//      A Required Source field will fail submission without a
//      valid form and data in submission field.
//      A Public Source field will allow submissions from other
//      users, regardless of the scope of this form. A Private Source
//      will NOT allow submission from other users forms.
//
//  params are { field, style, state }
export const SourceField = ({params}) => {

    var field = params.field;
    var style = {};
    const state = params.state;
    var readOnly = false;

    // Value is value.formally, value.form, value.data
    // TODO: drop value.form and read it from backend

    // Read inherited value from the state, set read only
    if (state)
    {
      if (state.inheritState && state.inheritState[field.name])
      {
        field.value = state.inheritState[field.name];
        readOnly = true;
      }

      // Otherwise use value from the init state
      else if (state.initState && state.initState[field.name])
        field.value = state.initState[field.name];
    }

    // Use style parameter if present - precendence text then input
    if (params.style)
    {
      if (params.style.text)
        style = params.style.text;
      else if (params.style.input)
        style = params.style.input;
    }

    if (field.value && field.value.length > 0)
      field.value = JSON.parse(field.value);

//    console.log("TextField (" + field.name + ", " + field.type + ", " + field.value + "," +
//                JSON.stringify(style) + ", " + field.min + ", " + field.max + ", " +
//                JSON.stringify(state) + ", " + readOnly);
    return (readOnly ?
             <input 
                    type={field.type}
                    placeholder={field.name}
                    name={field.name}
                    id={field.name}
                    defaultValue={field.value}
                    minLength={field.min}
                    maxLength={field.max}
                    style={style}
                    readOnly
             />
             : typeof field.value === 'object' && field.value !== null && field.max > 0 ? // read only
               <SourceRender name={field.name} value={field.value.form} style={style}
                          state={{ inheritState : field.value.data }}/>
             : typeof field.value === 'object' && field.value !== null ? // read-write
               <SourceRender name={field.name} value={field.value.form} style={style}
                          state={{ initState : field.value.data }}/>
            :
             "No queued input: " + field.value
           );
}

export default SourceField;
