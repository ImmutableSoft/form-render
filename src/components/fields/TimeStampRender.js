import { useState, useEffect } from "react"; 

  // Render Number field
  //  params are { field, style, state }
  const TimeStampField = ({params}) => {
    const [timestampData, setTimestampData] = useState("");
    const [currentTime, setCurrentTime] = useState(0);

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

    // Use style parameter if present - precendence native then input
    if (params.style)
    {
      if (params.style.timestamp)
        style = params.style.timestamp;
      else if (params.style.input)
        style = params.style.input;
    }

// UIcons by <a href="https://www.flaticon.com/uicons">Flaticon</a>

  useEffect(() => {
    // If read only, display but do not update time
    if (readOnly)
    {
      const timestamp = new Date(Number(field.value));
      setCurrentTime(Number(timestamp.getTime()));
      setTimestampData(timestamp.toLocaleString('en-US'));
    }

    // Otherwise update to current time
    else
    {
      const timestamp = new Date();
      setCurrentTime(Number(timestamp.getTime()));
      setTimestampData(timestamp.toLocaleString('en-US'));
    }
    
  }, [field.value, readOnly]);


//    console.log("TextField (" + field.name + ", " + field.type + ", " + field.value + "," +
//                JSON.stringify(style) + ", " + field.min + ", " + field.max + ", " +
//                JSON.stringify(state) + ", " + readOnly);
    return (readOnly ?
                <div style={style}>
                  { timestampData }
                </div>
               :
                <div style={style}>
                  <input 
                    type='number'
                    name={field.name}
                    id={field.name}
                    value={currentTime}
                    onSubmit={(e) => {
                                      const newTime = new Date();
                                      setCurrentTime(newTime.getTime());
                                      e.value = newTime.getTime();
                                      // TODO this does not work. value submitted is old
                                    }}
                    readOnly
                    hidden
                  />
                    { timestampData }
                </div>
               );
  }

export default TimeStampField;
