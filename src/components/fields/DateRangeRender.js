import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { addDays } from 'date-fns';
import { useEffect, useState } from 'react';

  // Render DateRange field
  //  params are { field, style, state }
const DateRangeField = ({params}) => {
  var readOnly = false;
  var field = params.field;
  var style = {};

  const [dateRange, setDateRange] = useState([
    {
      startDate: addDays(new Date(), 1),
      endDate:addDays(new Date(), 3),
      key: 'selection'
    }
  ]);
      
  useEffect(() => {

    const state = params.state;

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
      else
      {
        const theDate = new Date();
//        console.log(theDate);
        field.value = addDays(theDate, 1).toDateString() + "," +
                      addDays(theDate, 3).toDateString();
      }
    }

    // Use style parameter if present - precendence text then input
    if (params.style)
    {
      if (params.style.number)
        style = params.style.number;
      else if (params.style.input)
        style = params.style.input;
    }
  }, [params]);

  useEffect(() => {

//      console.log(field.value.split(',')[0] + ":" + field.value.split(',')[1]);
      const startDate = new Date(field.value.split(',')[0]);
      const endDate = new Date(field.value.split(',')[1]);
      const oneDay = 1000 * 60 * 60 * 24;
      const numDays = Math.floor(Math.abs((endDate - startDate) / oneDay));
//      console.log(startDate + ":" + endDate + "=" + numDays);
      
      setDateRange([
        {
          startDate: addDays(startDate, 0),
          endDate:addDays(endDate, 0),
          key: 'selection'
        }]);
  }, [field.value]);

//    console.log("DateRangeField (" + field.name + ", " + field.type + ", " + field.value + "," +
//                JSON.stringify(style) + ", " + field.min + ", " + field.max + ", " +
//                JSON.stringify(state) + ", " + readOnly);
    return (readOnly ?
             <input 
                    type="text"
                    placeholder={field.name}
                    name={field.name}
                    id={field.name}
                    defaultValue={field.value}
                    min={field.min}
                    max={field.max}
                    style={style}
                    readOnly
             />
             :
             <>
              <DateRange
                editableDateInputs={true}
                onChange={item => { setDateRange([item.selection]);
                                    field.value = item.selection.startDate.toDateString() + ',' + item.selection.endDate.toDateString();}}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
              />
              <br/>
              <input 
                        type="text"
                        placeholder={field.name}
                        name={field.name}
                        id={field.name}
                        value={field.value}
                        style={style}
                        hidden
                 />
             </>);
  }

export default DateRangeField;
