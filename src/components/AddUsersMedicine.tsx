import React from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const oldHome = [
  { label: 'Ratan par', year: 1994 },
  { label: 'Ratan', year: 1994 },
  { label: 'Ra', year: 1994 },
  { label: 'Rata', year: 1994 },
]

export default function AddUsersMedicine() {
  // useEffect({

  // },[])


  return (
    <React.Fragment>
       <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={oldHome}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Movie" />}
        />
    </React.Fragment>
  )
}
