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
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useSnackbar } from 'notistack'

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
    grNumber: number
    name: string
    isActive: boolean
    oldejHome: string
    medicines: Array<Medicine>
    notes: string
    _id: string
  }
}

export default function AddUsers({ open, setOpen, menu }: Props) {
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const [oldejHomeList, setOldejHomeList] = React.useState([])
  // const [medicineList, setMedicineList] = React.useState([])
  const [formValues, setFormValues] = React.useState({
    name: menu.name,
    oldejHome: menu.oldejHome,
    isActive: menu.isActive,
    medicines: menu.medicines,
    notes: menu.notes,
    _id: menu._id,
    grNumber: menu.grNumber
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
      grNumber: menu.grNumber || 0
    })
  }, [menu])
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
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
        enqueueSnackbar('Record Added or Updated successfully ', { variant: 'success' })
        setFormValues({
          name: '',
          oldejHome: '',
          isActive: true,
          medicines: [],
          notes: '',
          _id: '',
          grNumber: 0
        })
        setOpen(false)
      } else {
        enqueueSnackbar('Soothing Wrong, Check Console or Connect to Hardik ', { variant: 'error' })
      }
    } catch (error) {
      enqueueSnackbar('Soothing Wrong, Check Console or Connect to Hardik ', { variant: 'error' })
      console.error(error)
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
    try {
      const rawoldejHomeResponse = await fetch('/api/oldejHome')

      const oldejHomeResponse = await rawoldejHomeResponse.json()
      if (oldejHomeResponse.success) {
        setOldejHomeList(oldejHomeResponse.allOldejHome)
      } else {
        enqueueSnackbar('Soothing Wrong, Check Console or Contact to Hardik', { variant: 'error' })
      }
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Soothing Wrong, Check Console or Contact to Hardik', { variant: 'error' })
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
      <Dialog open={open} fullWidth maxWidth="md" fullScreen={useMediaQuery(theme.breakpoints.down('md'))}>
        <DialogTitle>{menu._id === '' ? 'New Elder' : 'Update Elder ' } { menu._id === '' ? '' : 'GR Number: '+ menu.grNumber}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <DialogContent>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item lg={4} md={4} sm={4} xl={4} xs={12}>
                  <TextField
                    margin="dense"
                    id="name"
                    value={formValues.name}
                    label="Elder Name"
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
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 2 }}>
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
                    label="Notes for Elder"
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
                  grNumber: menu.grNumber || 0
                })
                setOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              {menu._id === '' ? 'Save' : 'Update'} Elder
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </React.Fragment>
  )
}
