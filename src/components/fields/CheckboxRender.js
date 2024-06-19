  // Render Checkbox field
  //  params are { field, style, state }
  const CheckboxField = ({params}) => {

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
      if (params.style.checkbox)
        style = params.style.checkbox;
      else if (params.style.number)
        style = params.style.number;
    }

//    console.log("TextField (" + field.name + ", " + field.type + ", " + field.value + "," +
//                JSON.stringify(style) + ", " + field.min + ", " + field.max + ", " +
//                JSON.stringify(state) + ", " + readOnly);
    return (readOnly ?
                <>
                  <input 
                    type={field.type}
                    placeholder={field.name}
                    name={field.name}
                    id={field.name}
                    defaultValue={field.value}
                    style={style}
                    readOnly
                  />
                  { field.description }
                </>
               :
                <>
                  <input 
                    type={field.type}
                    placeholder={field.name}
                    name={field.name}
                    id={field.name}
                    style={style}
                  />
                  { field.description }
                </>
               );
  }

export default CheckboxField;
