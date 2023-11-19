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

interface Props {
  open: boolean
  setOpen: (boolean) => void
  menu: {
    name: string
    isActive: boolean
    oldejHome: string
    medicines: Array<object>
    notes: string
    _id: string
  }
}

const oldHome = [
  { label: 'Ratan par', year: 1994 },
  { label: 'Ratan', year: 1994 },
  { label: 'Ra', year: 1994 },
  { label: 'Rata', year: 1994 },
]

export default function AddUsers({ open, setOpen, menu }: Props) {
  const [formValues, setFormValues] = React.useState({
    name: '',
    oldejHome: '',
    isActive: true,
    medicines: [],
    notes: '',
    _id: '',
  })

  React.useEffect(() => {
    setFormValues({
      name: menu.name || '',
      oldejHome: menu.oldejHome || '',
      isActive: menu.isActive || true,
      medicines: menu.medicines || [],
      notes: menu.notes || '',
      _id: menu._id || '',
    })
  }, [menu])
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const bodyContent = JSON.stringify(formValues)

    const headersList = {
      Accept: '*/*',
      'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
      'Content-Type': 'application/json',
    }

    const response = await fetch('/api/medicine', {
      method: formValues._id === '' ? 'POST' : 'PUT',
      body: bodyContent,
      headers: headersList,
    })

    const responseData = await response.json()
    if (responseData.success) {
      console.log(responseData)
      setFormValues({ name: '', oldejHome: '', isActive: true, medicines: [], notes: '', _id: '' })
      setOpen(false)
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

  return (
    <React.Fragment>
      <Dialog open={open}>
        <DialogTitle>{menu._id === '' ? 'Add' : 'Update'} User</DialogTitle>
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <DialogContent>
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
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={oldHome}
              sx={{ width: '100%' }}
              renderInput={(params) => <TextField required fullWidth variant="standard" {...params} label="Oldej Home" />}
            />
            <TextField
              margin="dense"
              id="inStock"
              name="inStock"
              // value={formValues.inStock}
              label="Stock"
              type="number"
              fullWidth
              variant="standard"
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              value={formValues.notes}
              id="notes"
              name="notes"
              label="Notes"
              type="text"
              multiline
              rows={4}
              fullWidth
              variant="standard"
              onChange={handleInputChange}
            />
            <TextField
              value={formValues._id}
              id="_id"
              name="_id"
              label="_id"
              type="hidden"
              variant="standard"
              onChange={handleInputChange}
            />
            <FormControlLabel
              control={
                <Checkbox

                  checked={formValues.isActive}
                  onChange={handleInputChange}
                  name="isActive"
                />
              }
              label="Active"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setFormValues({ name: '', oldejHome: '', isActive: true, medicines: [], notes: '', _id: '' })
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
