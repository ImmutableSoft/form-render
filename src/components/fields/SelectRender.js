
  // Render Select field
  //  params are { field, style, state }
  const SelectField = ({params}) => {

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

    // Use style parameter if present - precendence select then input
    if (params.style)
    {
      if (params.style.select)
        style = params.style.select;
      else if (params.style.input)
        style = params.style.input;
    }

//    console.log("TextField (" + field.name + ", " + field.type + ", " + field.value + "," +
//                JSON.stringify(style) + ", " + field.min + ", " + field.max + ", " +
//                JSON.stringify(state) + ", " + readOnly);
    var selectValues = [];
    if (field.description && (field.description.length > 0))
      selectValues = field.description.split(',');
    
    return (readOnly ?
                <select 
                  name={field.name}
                  id={field.name}
                  style={style}
                  value={field.value}
                  readOnly
                >
                {
                  selectValues.map((value) =>
                    <option value={value} key={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>
                  )
                }
                </select>
              :
                <select 
                  name={field.name}
                  id={field.name}
                  style={style}
                  defaultValue={field.value}
                >
                {
                  selectValues.map((value) =>
                    <option value={value} key={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>
                  )
                }
                </select>
               );
  }

export default SelectField;
