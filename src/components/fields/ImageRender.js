import { useState, useEffect } from "react"; 

  // Render Image field
  //  params are { field, style, state }
  const ImageField = ({params}) => {
    const [imageData, setImageData] = useState("");

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
      setImageData(field.value);
  }, [field.value, field.min]);

  const handleFileToUrlChange = (e) => { 
    e.preventDefault();
    const file = e.target.files[0];

    // Encode the file using the FileReader API
    const reader = new FileReader();
    reader.onloadend = () => {
//      const newFields = [...changedFields]; 
//      newFields[i] = reader.result;
//      setChangedFields(newFields);
      console.log("Data image length:" + reader.result.length);
      if (reader.result.length > (20 * 1014 * 1024))
        setImageData("Image data too large. 20MB maximum.");
      else
        setImageData(reader.result);
//      console.log(newFields);
    };
    reader.readAsDataURL(file);
  }; 


//    console.log("TextField (" + field.name + ", " + field.type + ", " + field.value + "," +
//                JSON.stringify(style) + ", " + field.min + ", " + field.max + ", " +
//                JSON.stringify(state) + ", " + readOnly);
    return (readOnly ?
                <div>
                  { ((imageData?.length > 0) && (imageData.startsWith('data:') ||
                    imageData.startsWith(process.env.REACT_APP_BACKEND_URL))) ? <img alt={field.name} src={imageData} width="60%"></img> : "" }
                  <br/>
                  { imageData?.slice(0, 80) + (imageData?.length > 80 ? '...' : '') }
                  <br/>
                  {
                     (field.min == 1) ?
                      <input 
                        type='url'
                        placeholder={field.name}
                        name={field.name}
                        defaultValue={imageData}
                        readOnly
                        hidden
                      />
                    :
                      ""
                  }
                </div>
               :
                <div>
                  { ((imageData?.length > 0) && (imageData.startsWith('data:') ||
                    imageData.startsWith(process.env.REACT_APP_BACKEND_URL))) ? <img alt={field.name} src={imageData} width="60%"></img> : "" }
                  <br/>
                  { imageData?.slice(0, 80) + (imageData?.length > 80 ? '...' : '') }
                  <br/>
                  {
                    (field.min == 1) ?
                      <input 
                        type='url'
                        placeholder={field.name}
                        name={field.name}
                        defaultValue={imageData}
                        readOnly
                        hidden
                      />
                    :
                      ""
                  }
                  <input 
                    type="file"
                    accept="image/*"
                    style={style}
                    placeholder={field.name}
                    name={field.name + (field.min == 1 ? "File" : "")}
                    id={field.name}
                    onChange={(e) => { handleFileToUrlChange(e) }
                    }
                  />
                </div>
               );
  }

export default ImageField;
