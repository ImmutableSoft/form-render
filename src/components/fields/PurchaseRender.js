  // Render Purchase field
  //  params are { field, style, state }
  const PurchaseField = ({params}) => {

    var field = params.field;
    var style = {};
    const state = params.state;

    // Read inherited value from the state, set read only
    if (state)
    {
      if (state.inheritState && state.inheritState[field.name])
      {
        console.log("inheritState " + state.inheritState[field.name]);
        field.value = state.inheritState[field.name];
      }

      // Otherwise use value from the init state
      else if (state.initState && state.initState[field.name])
        field.value = state.initState[field.name];
    }

    // Use style parameter if present - precendence text then input
    if (params.style)
    {
      if (params.style.number)
        style = params.style.number;
      else if (params.style.input)
        style = params.style.input;
    }

//    console.log("TextField (" + field.name + ", " + field.type + ", " + field.value + "," +
//                JSON.stringify(style) + ", " + field.min + ", " + field.max + ", " +
//                JSON.stringify(state) + ", " + readOnly);
    return (
              <div style={style}>
                <input 
                  type='text'
                  name={field.name}
                  id={field.name}
                  defaultValue={field.value}
                  readOnly
                  hidden
                />
                Purchase {field.name + '(' + field.value + ')'}
                { /*() => { setTotalPrice(totalPrice + field.min)}*/ }
              </div>
               );
  }

export default PurchaseField;
