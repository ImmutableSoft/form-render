import { useState, useEffect } from "react"; 

  // Render Video field
  //  params are { field, style, state }
  const VideoField = ({params}) => {
    const [videoData, setVideoData] = useState("");

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
      if (params.style.image)
        style = params.style.image;
      else if (params.style.file)
        style = params.style.file;
    }

  useEffect(() => {
    if (field.value)
      setVideoData(field.value);
  }, [field.value]);


  const handleFileToUrlChange = (e) => { 
    e.preventDefault();
    const file = e.target.files[0];
    setVideoData(file);
  }; 


//    console.log("TextField (" + field.name + ", " + field.type + ", " + field.value + "," +
//                JSON.stringify(style) + ", " + field.min + ", " + field.max + ", " +
//                JSON.stringify(state) + ", " + readOnly);
    return (readOnly ?
                <div>
                  {
                    ((videoData?.length > 0) &&
                     videoData.startsWith(process.env.REACT_APP_BACKEND_URL)) ?
                        <video controls width="100%">
                          <source src={videoData} type={"video/" + videoData.split('.').pop()} />
                        </video>
                       : ""
                  }
                  { videoData }
                  <br/>
                </div>
               :
                <div>
                  {
                    ((videoData?.length > 0) &&
                     videoData.startsWith(process.env.REACT_APP_BACKEND_URL)) ?
                        <video controls width="100%">
                          <source src={videoData} type={"video/" + videoData.split('.').pop()} />
                        </video>
                       : ""
                  }
                  { videoData }
                  <br/>
                  <input 
                    type="file"
                    accept="video/*"
                    style={style}
                    placeholder={field.name}
                    name={field.name}
                    id={field.name}
                    onChange={(e) => { handleFileToUrlChange(e) }
                    }
                  />
                </div>
               );
  }

export default VideoField;
