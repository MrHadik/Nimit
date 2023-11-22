import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import Grid from '@mui/material/Grid'
import AddUsersMedicine from './AddUsersMedicine'

interface Medicine {
  id: number
  medicineName: string
  quantity: string
  isStar: boolean
}

interface Props {
  open: boolean
  setOpen: (boolean) => void
  menu: {
    name: string
    isActive: boolean
    oldejHome: string
    medicines: Array<Medicine>
    notes: string
    _id: string
  }
}

export default function AddUsers({ open, setOpen, menu }: Props) {
  const [oldejHomeList, setOldejHomeList] = React.useState([])
  // const [medicineList, setMedicineList] = React.useState([])
  const [formValues, setFormValues] = React.useState({
    name: menu.name,
    oldejHome: menu.oldejHome,
    isActive: menu.isActive,
    medicines: menu.medicines,
    notes: menu.notes,
    _id: menu._id,
  })
  React.useEffect(() => {
    getOldejHomeList()
  }, [])

  React.useEffect(() => {
    setFormValues({
      name: menu.name || '',
      oldejHome: menu.oldejHome || '',
      isActive: menu.isActive,
      medicines: menu.medicines,
      notes: menu.notes || '',
      _id: menu._id || '',
    })
  }, [menu])
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      console.log(formValues)
      const bodyContent = JSON.stringify(formValues)

      const headersList = {
        Accept: '*/*',
        'Content-Type': 'application/json',
      }

      const response = await fetch('/api/oldej', {
        method: formValues._id === '' ? 'POST' : 'PUT',
        body: bodyContent,
        headers: headersList,
      })

      const responseData = await response.json()
      if (responseData.success) {
        console.log(responseData)
        setFormValues({
          name: '',
          oldejHome: '',
          isActive: true,
          medicines: [],
          notes: '',
          _id: '',
        })
        setOpen(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }))
  }

  const getOldejHomeList = async () => {
    const rawoldejHomeResponse = await fetch('/api/oldejHome')

    const oldejHomeResponse = await rawoldejHomeResponse.json()
    if (oldejHomeResponse.success) {
      setOldejHomeList(oldejHomeResponse.allOldejHome)
    }
  }

  const handleMedicineSave = (medicineList) => {
    // Do something with the medicineList received from AddUsersMedicine
    setFormValues((prevValues) => ({
      ...prevValues,
      medicines: medicineList,
    }))
  }

  return (
    <React.Fragment>
      <Dialog open={open} fullWidth maxWidth="md">
        <DialogTitle>{menu._id === '' ? 'Add' : 'Update'} User</DialogTitle>
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <DialogContent>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item lg={4} md={4} sm={4} xl={4} xs={12}>
                  <TextField
                    margin="dense"
                    id="name"
                    value={formValues.name}
                    label="Name"
                    name="name"
                    required
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item lg={4} md={4} sm={4} xl={4} xs={12}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={oldejHomeList.map((option) => option.OldejHome)}
                    sx={{ width: '100%' }}
                    value={formValues.oldejHome} // Assign value prop
                    onChange={(event, value) => {
                      setFormValues((prevValues) => ({
                        ...prevValues,
                        oldejHome: value || '', // Update oldejHome value
                      }))
                    }}
                    renderInput={(params) => (
                      <TextField
                        required
                        fullWidth
                        name="oldejHome"
                        variant="standard"
                        margin="dense"
                        {...params}
                        label="Oldej Home"
                      />
                    )}
                  />
                </Grid>
                <Grid item lg={4} md={4} sm={4} xl={4} xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' , paddingTop: 2}}>
                    <FormControlLabel
                      control={<Checkbox checked={formValues.isActive} onChange={handleInputChange} name="isActive" />}
                      label="Active"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <AddUsersMedicine onMedicineSave={handleMedicineSave} editMedicinesList={formValues.medicines} />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    value={formValues.notes}
                    id="notes"
                    name="notes"
                    label="Notes"
                    type="text"
                    multiline
                    rows={2}
                    fullWidth
                    variant="standard"
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Box>
            <TextField
              value={formValues._id}
              id="_id"
              name="_id"
              label="_id"
              type="hidden"
              variant="standard"
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setFormValues({
                  name: menu.name || '',
                  oldejHome: menu.oldejHome || '',
                  isActive: menu.isActive || true,
                  medicines: menu.medicines || [],
                  notes: menu.notes || '',
                  _id: menu._id || '',
                })
                setOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </React.Fragment>
  )
}
