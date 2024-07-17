  // Render Queue field
  //  a Queue field contains the form path that the submission is
  //  to be saved under. <username>/<formname>/<objectname>.
  //    ex) TestOrg/TestForm/ObjectName
  //  NOTE: This Queue To form MUST contain a SourceField named
  //  <objectname> or the submission will fail.
  //
  //  params are { field, style, state }
  const QueueField = ({params}) => {

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

//    console.log("QueueField (" + field.name + ", " + field.type + ", " + field.value + "," +
//                JSON.stringify(style) + ", " + field.min + ", " + field.max + ", " +
//                JSON.stringify(state) + ", " + readOnly);
    return (
             <input 
                    type={field.type}
                    placeholder="Queue <user>/<form>/<object>"
                    name={field.name}
                    id={field.name}
                    defaultValue={field.value}
                    minLength={field.min}
                    maxLength={field.max}
                    style={style}
                    readOnly
             />
           );
  }

export default QueueField;
