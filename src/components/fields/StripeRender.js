  // Render Stripe field
  //  params are { field, style, state }
  const StripeField = ({params}) => {

    var field = params.field;
    var style = {};
    const state = params.state;

    // Read inherited value from the state, set read only
    if (state)
    {
      if (state.inheritState && state.inheritState[field.name])
      {
        field.value = state.inheritState[field.name];
      }

      // Otherwise use value from the init state
      else if (state.initState && state.initState[field.name])
        field.value = state.initState[field.name];
    }

    // Use style parameter if present - precendence text then input
    if (params.style)
    {
      if (params.style.stripe)
        style = params.style.stripe;
      else if (params.style.input)
        style = params.style.input;
    }

//    console.log("TextField (" + field.name + ", " + field.type + ", " + field.value + "," +
//                JSON.stringify(style) + ", " + field.min + ", " + field.max + ", " +
//                JSON.stringify(state) + ", " + readOnly);
    return (
             <div style={style} >
               <input 
                 type='text'
                 name={field.name}
                 id={field.name}
                 defaultValue={field.value}
                 readOnly
                 hidden
               />
               { field.value.length > 0 ? "Payment required." : "" }
             </div>
           );
  }

export default StripeField;
