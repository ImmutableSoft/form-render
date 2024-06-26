import { useState, useEffect } from "react"; 
import SignaturePad from "react-signature-canvas";

  // Render Signature field
  //  params are { field, style, state }
  const SignatureField = ({params}) => {
    const [sigData, setSigData] = useState("");

    var field = params.field;
    var style = {};
    const state = params.state;
    var readOnly = false;

    // If state exists, apply it
    if (state)
    {
      // Read inherited value from the state, set read only
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
      if (params.style.signature)
        style = params.style.signature;
      else if (params.style.file)
        style = params.style.file;
    }

  var sigPad = {};

  const clear = () => {
    sigPad.clear()
  }

  const signaturePadRef = (ref) => {
    sigPad = ref;
  }
  const clearSignature = (event) => {
    clear();
  }

  useEffect(() => {
    if (sigData?.length === 0)
      setSigData(field.value);
    sigPad.fromDataURL(field.value);
  }, [field.value, sigPad]);

  useEffect(() => {
    sigPad.fromDataURL(sigData);
  }, [sigData, sigPad]);

/*
  useEffect(() => {
    if (sigPad.fromDataURL && (sigData > 0))
      sigPad.fromDataURL(sigData);
  }, [sigPad, sigData]);
*/

//    console.log("TextField (" + field.name + ", " + field.type + ", " + field.value + "," +
//                JSON.stringify(style) + ", " + field.min + ", " + field.max + ", " +
//                JSON.stringify(state) + ", " + readOnly);
    return (readOnly ?
                <div>
                    <img alt="signature" style={style} src={sigData} />
                    <input 
                      type='url'
                      placeholder={field.name}
                      name={field.name}
                      id={field.name}
                      defaultValue={field.value}
                      readOnly
                      hidden
                    />
                </div>
               :
                <div>
                    <SignaturePad name={field.name + "Pad"}
                      ref={(ref) => signaturePadRef(ref) }
                      canvasProps={style.canvasProps ? Object.assign(style.canvasProps,
                                              {width: "420px", className: 'sigCanvas'}) :
                           {width: "420px", className: 'sigCanvas'}}
                      penColor={style.penColor ? style.penColor : "black"}
                      backgroundColor={style.backgroundColor ? style.backgroundColor : "#D0D0D0"}
                      onEnd = {(e) => {
                          var sig = sigPad.getTrimmedCanvas();
                          setSigData(sig.toDataURL("image/png"));
                         }
                      }
                    />
                    <input 
                      type='url'
                      name={field.name}
                      id={field.name}
                      defaultValue={sigData}
                      readOnly
                      hidden
                    />
                    <button className="secondaryButton" onClick={(event) => {
                                                                 event.preventDefault();
                                                                 clearSignature(event);
                              }}>
                      <span >Clear</span>
                   </button>
                </div>
               );
  }

export default SignatureField;
