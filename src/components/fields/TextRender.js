  // Render Text field
  //  params are { field, style, state }
  const TextField = ({params}) => {

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
      if (params.style.text)
        style = params.style.text;
      else if (params.style.input)
        style = params.style.input;
    }

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
             : Number(field.min) === 0 ?
               <input 
                      type={field.type}
                      placeholder={field.name}
                      name={field.name}
                      id={field.name}
                      defaultValue={field.value}
                      minLength={field.min}
                      maxLength={field.max}
                      style={style}
               />
               :
                 <input 
                        type={field.type}
                        placeholder={field.name}
                        name={field.name}
                        id={field.name}
                        defaultValue={field.value}
                        minLength={field.min}
                        maxLength={field.max}
                        style={style}
                        required
                 />
               );
  }

export default TextField;
