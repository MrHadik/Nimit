// import React, { useEffect, useState } from 'react'
// import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
// import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
// import { Box, Button, SvgIcon } from '@mui/material'
// import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import Grid from '@mui/material/Grid'
import FormControlLabel from '@mui/material/FormControlLabel'
// import Checkbox from '@mui/material/Checkbox'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import PlusIcon from '@heroicons/react/24/solid/PlusIcon'

// export default function AddUsersMedicine() {
//   const [Medicine, setMedicine] = useState([])
//   const [tempObj, setTempObj] = useState([]) // State for storing added medicine entries
//   let idNumber = 0
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [UsersMedicineList, setUsersMedicineList] = useState({ id: 0, medicineName: '', quonty: '', isStar: false })

//   useEffect(() => {
//     GetMedicine()
//   }, [])

//   const columns = [
//     // { field: 'id', headerName: 'ID', width: 90 },
//     {
//       field: 'medicineName',
//       headerName: 'Medicine',
//       width: 350,
//     },
//     {
//       field: 'quonty',
//       headerName: 'Quonty',
//       width: 150,
//     },
//     {
//       field: 'isStar',
//       headerName: 'Star',
//       width: 150,
//     },
//     {
//       field: 'actions',
//       type: 'actions',
//       headerName: 'Actions',
//       width: 150,
//       cellClassName: 'actions',
//       getActions: (Users) => {
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         function handleDeleteClick(row: object) {
//           throw new Error('Function not implemented.')
//         }

//         return [
//           <GridActionsCellItem
//             key={`delete-${Users.id}`}
//             icon={<DeleteIcon />}
//             label="Delete"
//             onClick={() => handleDeleteClick(Users.row)}
//             sx={{
//               color: 'error.main',
//             }}
//           />,
//         ]
//       },
//     },
//   ]

//   const onChange = (e) => {
//     setUsersMedicineList({ ...UsersMedicineList, [e.target.name]: e.target.value })
//     console.log(UsersMedicineList)
//   }

//   const addData = () => {
//     if (UsersMedicineList.medicineName !== '' && UsersMedicineList.quonty !== '') {
//       idNumber += 1
//       const newEntry = {
//         id: idNumber,
//         medicineName: UsersMedicineList.medicineName,
//         quonty: UsersMedicineList.quonty,
//         isStar: UsersMedicineList.isStar,
//       }
//       // Update state with the new entry and previous entries
//       setUsersMedicineList({
//         id: 0,
//         medicineName: '',
//         quonty: '',
//         isStar: false,
//       })
//       setTempObj((prevState) => [...prevState, newEntry])
//     } else {
//       alert('Please Enter Data')
//     }
//   }

//   const GetMedicine = async () => {
//     try {
//       const response = await fetch('/api/medicine')

//       const responseData = await response.json()
//       if (responseData.success) {
//         const dataWithIds = responseData.Medicines.map((row, index) => ({
//           ...row,
//           id: index + 1,
//         }))

//         setMedicine(dataWithIds)
//       }
//     } catch (error) {
//       alert(error)
//       console.error('Error fetching data:', error)
//     }
//   }

//   return (
//     <React.Fragment>
//       <Grid container spacing={2}>
//         <Grid item lg={4} md={4} sm={4} xl={4} xs={12}>
// <Autocomplete
//   disablePortal
//   id="combo-box-demo"
//   options={Medicine.map((option) => option.medicineName)}
//   sx={{ width: '100%' }}
//   onChange={onChange}
//   renderInput={(params) => (
//     <TextField margin="dense" {...params} fullWidth variant="standard" label="Medicine" />
//   )}
// />
//         </Grid>
//         <Grid item lg={4} md={4} sm={4} xl={4} xs={12}>
//           <TextField
//             margin="dense"
//             id="Quantity"
//             name="quonty"
//             // value={formValues.inStock}
//             label="Quantity"
//             type="number"
//             fullWidth
//             variant="standard"
//             onChange={onChange}
//             // onChange={handleInputChange}
//           />
//         </Grid>
//         <Grid item lg={4} md={4} sm={4} xl={4} xs={12}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//             <FormControlLabel
//               control={<Checkbox icon={<StarBorderIcon />} checkedIcon={<StarIcon />} name="isStar" />}
//               label="Star"
//             />
//             <Button
//               size="small"
//               startIcon={
//                 <SvgIcon fontSize="small">
//                   <PlusIcon />
//                 </SvgIcon>
//               }
//               onClick={addData}
//               variant="contained"
//             >
//               Add
//             </Button>
//           </Box>
//         </Grid>
//       </Grid>

//       <Box sx={{ width: '100%', minHeight: 200 }}>
//         <DataGrid rowHeight={25} rows={tempObj} columns={columns} pageSizeOptions={[100]} disableRowSelectionOnClick />
//       </Box>
//     </React.Fragment>
//   )
// }

import React, { useState, useEffect } from 'react'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import DeleteIcon from '@mui/icons-material/Delete'
import SvgIcon from '@mui/icons-material/StarBorder'

export default function MedicineList() {
  const [medicineList, setMedicineList] = useState([])
  const [medicineName, setMedicineName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [isStar, setIsStar] = useState(false)
  const [Medicine, setMedicine] = useState([])

  useEffect(() => {
    GetMedicine()
  }, [])

  const handleAddMedicine = () => {
    console.log(medicineList)
    if (medicineName.trim() !== '' && quantity.trim() !== '') {
      const newMedicine = {
        id: medicineList.length + 1,
        medicineName,
        quantity,
        isStar,
      }
      setMedicineList([...medicineList, newMedicine])
      // Clear the form fields after adding medicine
      setMedicineName('')
      setQuantity('')
      setIsStar(false)
    } else {
      alert('Please enter medicine details')
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'medicineName', headerName: 'Medicine', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 150 },
    {
      field: 'isStar',
      headerName: 'Star',
      width: 100,
      renderCell: (params) => (
        <Checkbox icon={<StarBorderIcon />} checkedIcon={<StarIcon />} checked={params.value} disabled />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key={`delete-${params.row.id}`}
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.row.id)}
        />,
      ],
    },
  ]

  const handleDelete = (id) => {
    const updatedList = medicineList.filter((medicine) => medicine.id !== id)
    setMedicineList(updatedList)
  }

  const GetMedicine = async () => {
    try {
      const response = await fetch('/api/medicine')

      const responseData = await response.json()
      if (responseData.success) {
        const dataWithIds = responseData.Medicines.map((row, index) => ({
          ...row,
          id: index + 1,
        }))
        setMedicine(dataWithIds)
      }
    } catch (error) {
      alert(error)
      console.error('Error fetching data:', error)
    }
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item lg={4} md={4} sm={4} xl={4} xs={12}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={Medicine.map((option) => option.medicineName)}
            sx={{ width: '100%' }}
            value={medicineName}
            onChange={(event, value) => setMedicineName(value)} // Set the selected value
            renderInput={(params) => (
              <TextField margin="dense" {...params}  fullWidth variant="standard" label="Medicine Name" />
            )}
          />
        </Grid>
        <Grid item lg={4} md={4} sm={4} xl={4} xs={12}>
          <TextField
            label="Quantity"
            variant="standard"
            type="number"
            fullWidth
            name='quantity'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            margin="dense"
          />
        </Grid>
        <Grid item lg={4} md={4} sm={4} xl={4} xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isStar}
                  onChange={(e) => setIsStar(e.target.checked)}
                  icon={<StarBorderIcon />}
                  checkedIcon={<StarIcon />}
                  name="isStar"
                />
              }
              label="Star"
            />

            <Button
              variant="contained"
              startIcon={
                <SvgIcon fontSize="small">
                  <PlusIcon />
                </SvgIcon>
              }
              onClick={handleAddMedicine}
            >
              Add
            </Button>
          </Box>
        </Grid>
      </Grid>
      <div style={{ width: '100%' }}>
        <DataGrid
          rowHeight={25}
          rows={medicineList}
          columns={columns}
          pageSizeOptions={[100]}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  )
}
