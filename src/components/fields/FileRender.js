import { useState, useEffect } from "react"; 

  // Render File field
  //  params are { field, style, state }
  const FileField = ({params}) => {
    const [fileData, setFileData] = useState("");

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
      if (params.style.file)
        style = params.style.file;
      else if (params.style.number)
        style = params.style.number;
    }

  useEffect(() => {
    if (field.min > 0)
      setFileData(field.value);
  }, [field.value, field.min]);

  const handleFileToUrlChange = (e) => { 
    e.preventDefault();
    const file = e.target.files[0];
    console.log("handleFileToUrlChange: " + file.name);

    // Encode the file using the FileReader API
    const reader = new FileReader();
    reader.onloadend = () => {
//      const newFields = [...changedFields]; 
//      newFields[i] = reader.result;
//      setChangedFields(newFields); 
      console.log("Data file length:" + reader.result.length);
      if (reader.result.length > (2 * 1014 * 1024))
        setFileData("Image data too large. 2MB maximum.");
      else
        setFileData(reader.result);
//      console.log(newFields);
    };
    reader.readAsDataURL(file);
  }; 


//    console.log("TextField (" + field.name + ", " + field.type + ", " + field.value + "," +
//                JSON.stringify(style) + ", " + field.min + ", " + field.max + ", " +
//                JSON.stringify(state) + ", " + readOnly);
    return (readOnly ?
                <div>
                  {
                     (field.min == 1) ?
                      <>
                      <input 
                        type='url'
                        placeholder={field.name}
                        name={field.name}
                        defaultValue={fileData}
                        readOnly
                        hidden
                      />
                      { fileData?.length > 0 ? fileData.startsWith('data:image/') ?
                              <img alt={field.name} src={fileData} width="60%"></img> :
                              fileData.slice(0, 10) + '...' : '' }
                      </>
                    :
                      ""
                  }
                  { field.min == 1 ? field.value.slice(0, 30) : field.value }
                </div>
               : field.type === 'files' ?
                <div>
                  { field.value }
                  <input 
                    type="file"
                    placeholder={field.name}
                    style={style}
                    name={field.name}
                    multiple
                  />
                </div>
                :
                <div>
                  {
                    (field.min == 1) ?
                     <>
                      { fileData?.length > 0 ? fileData.startsWith('data:image/') ?
                              <img alt={field.name} src={fileData} width="60%"></img> :
                              fileData.startsWith('Image data too large') ? fileData : fileData.slice(0, 30) + '...' : '' }
                      <input 
                        type='url'
                        placeholder={field.name}
                        name={field.name}
                        value={fileData}
                        readOnly
                        hidden
                      />
                    </>
                    :
                    field.value
                  }
                  <br />
                  <input 
                    type="file"
                    accept="*"
                    placeholder={field.name}
                    style={style}
                    name={field.name + (field.min == 1 ? "File" : "")}
                    id={field.value}
                    onChange={(e) => { if (field.min == 1) handleFileToUrlChange(e); }
                    }
                  />
                </div>
               );
  }

export default FileField;
