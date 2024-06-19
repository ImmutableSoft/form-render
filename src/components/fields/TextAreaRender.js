  // Render Text field
  //  params are { field, style, state }
  const TextAreaField = ({params}) => {

    var field = params.field;
    var style = {};
    const state = params.state;
    var readOnly = false;
    var cols = "40";
    var rows = "4";

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
      if (params.style.textarea)
        style = params.style.textarea;
      else if (params.style.input)
        style = params.style.input;

      if (params.style.rows)
        rows = params.style.rows;
      if (params.style.cols)
        cols = params.style.cols;
    }

//    console.log("TextField (" + field.name + ", " + field.type + ", " + field.value + "," +
//                JSON.stringify(style) + ", " + field.min + ", " + field.max + ", " +
//                JSON.stringify(state) + ", " + readOnly);
    return (readOnly ?
             <textarea cols={cols} rows={rows} 
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
             <textarea cols={cols} rows={rows} 
                    placeholder={field.name}
                    name={field.name}
                    id={field.name}
                    defaultValue={ field.value}
                    minLength={field.min}
                    maxLength={field.max}
                    style={style}
                  />
           :
             <textarea cols={cols} rows={rows} 
                    placeholder={field.name}
                    name={field.name}
                    id={field.name}
                    defaultValue={ field.value}
                    minLength={field.min}
                    maxLength={field.max}
                    style={style}
                    required
                  />
               );
  }

export default TextAreaField;
