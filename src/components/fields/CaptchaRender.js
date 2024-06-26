import { useState, useEffect, useRef } from "react"; 
import HCaptcha from '@hcaptcha/react-hcaptcha';

  // Render Captcha field
  //  params are { field, style, state }
  const CaptchaField = ({params}) => {

  const [token, setToken] = useState("");
  const captchaRef = useRef(null);

/*
  const onLoad = () => {
    // this reaches out to the hCaptcha JS API and runs the
    // execute function on it. you can use other functions as
    // documented here:
    // https://docs.hcaptcha.com/configuration#jsapi
    captchaRef.current.execute();
  };
*/

  useEffect(() => {

    if (token)
      console.log(`hCaptcha Token: ${token}`);

  }, [token]);

    var field = params.field;
    var style = {};
    const state = params.state;

    var readOnly = false;

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
      if (params.style.captcha)
        style = params.style.captcha;
      else if (params.style.number)
        style = params.style.number;
    }

//    console.log("TextField (" + field.name + ", " + field.type + ", " + field.value + "," +
//                JSON.stringify(style) + ", " + field.min + ", " + field.max + ", " +
//                JSON.stringify(state) + ", " + readOnly);
    return (readOnly || field.value.startsWith('P1_') ?
                <>
                  <input 
                    type='text'
                    name={field.name}
                    id={field.name}
                    defaultValue={field.value.length > 80 ? field.value.slice(0, 80) + '...' : ''}
                    readOnly
                  />
                  { field.value && field.value.startsWith('P1_') ? "Approved" : "Unapproved" }
                </>
               :
                <>
                  <HCaptcha
                    sitekey={field.value}
                    render="explicit"
                    onVerify={setToken}
                    ref={captchaRef}
                  />
                  <input 
                    type='text'
                    name={field.name}
                    id={field.name}
                    defaultValue={token}
                    readOnly
                    hidden
                  />
                </>
               );
  }

export default CaptchaField;
