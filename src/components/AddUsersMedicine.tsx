import Autocomplete from '@mui/material/Autocomplete'
import Grid from '@mui/material/Grid'
import FormControlLabel from '@mui/material/FormControlLabel'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import React, { useState, useEffect } from 'react'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

interface Medicine {
  id: number
  medicineName: string
  quantity: string
  isStar: boolean
}

export default function MedicineList({
  onMedicineSave,
  editMedicinesList,
}: {
  onMedicineSave: (any) => void
  editMedicinesList: Array<Medicine>
}) {
  const [medicineList, setMedicineList] = useState(editMedicinesList)
  const [medicineName, setMedicineName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [isStar, setIsStar] = useState(false)
  const [Medicine, setMedicine] = useState([]) /// list of Medicine like UDP-AT, ...

  useEffect(() => {
    GetMedicine()
  }, [])

  useEffect(() => {
    setMedicineList(editMedicinesList) // Update medicineList when editMedicinesList prop changes
  }, [editMedicinesList])

  const handleAddMedicine = () => {
    if (medicineName.trim() !== '' && quantity.trim() !== '') {
      const newMedicine: Medicine = {
        id: medicineList.length === 0 ? 1 : medicineList[medicineList.length - 1 ].id + 1 ,
        medicineName,
        quantity,
        isStar,
      }
      const updatedMedicineList = [...medicineList, newMedicine]
      setMedicineList(updatedMedicineList)
      setMedicineName('')
      setQuantity('')
      setIsStar(false)

      // Pass the updatedMedicineList to the callback function after state update
      onMedicineSave(updatedMedicineList)
    } else {
      alert('Please enter medicine details')
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'medicineName', headerName: 'Medicine', width: 230 },
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
    onMedicineSave(updatedList)
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
            onChange={(event, value) => {
              setMedicineName(value)
              Medicine.map((med) => {
                med.medicineName === value ? setIsStar(med.isStar) : ''
              })
            }}
            renderInput={(params) => (
              <TextField margin="dense" {...params} fullWidth variant="standard" label="Medicine Name" />
            )}
          />
        </Grid>
        <Grid item lg={4} md={4} sm={4} xl={4} xs={12}>
          <TextField
            label="Quantity"
            variant="standard"
            type="number"
            fullWidth
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            margin="dense"
          />
        </Grid>
        <Grid item lg={4} md={4} sm={4} xl={4} xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingX: 1}}>
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
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddMedicine}>
              Add
            </Button>
          </Box>
        </Grid>
      </Grid>
      <div style={{ width: '100%' }}>
        <DataGrid
          rowHeight={25}
          autoHeight
          rows={medicineList}
          columns={columns}
          pageSizeOptions={[100]}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  )
}
