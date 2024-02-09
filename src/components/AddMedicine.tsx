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
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import { useSnackbar } from 'notistack'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

interface Props {
  open: boolean
  setOpen: (boolean) => void
  menu: {
    medicineName: string
    isStar: boolean
    inStock: number
    notes: string
    _id: string
  }
}

export default function AddMedicine({ open, setOpen, menu }: Props) {
  const [loading, setLoading] = React.useState(false);
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const [formValues, setFormValues] = React.useState({
    medicineName: '',
    isStar: false,
    inStock: 0,
    notes: '',
    _id: '',
  })

  React.useEffect(() => {
    setFormValues({
      medicineName: menu.medicineName || '',
      isStar: menu.isStar || false,
      inStock: menu.inStock || 0,
      notes: menu.notes || '',
      _id: menu._id || '',
    })
  }, [menu])
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const bodyContent = JSON.stringify(formValues)
    try {
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
        enqueueSnackbar('Record Added or Updated successfully', { variant: 'success' })
        setFormValues({ medicineName: '', isStar: false, inStock: 0, notes: '', _id: '' })
        setLoading(false)
        setOpen(false)
      } else if (responseData.error.code === 11000) {
        enqueueSnackbar('Record Already Exist ', { variant: 'warning' })
        setLoading(false)
      } else {
        console.error('Error fetching data:', responseData)
        enqueueSnackbar('Soothing Wrong, Check Console or Contact to Hardik', { variant: 'error' })
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      enqueueSnackbar('Soothing Wrong, Check Console or Contact to Hardik', { variant: 'error' })
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
      <Dialog open={open} fullWidth fullScreen={useMediaQuery(theme.breakpoints.down('md'))}>
        <DialogTitle>{menu._id === '' ? 'New' : 'Update'} Medicine</DialogTitle>
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <DialogContent>
            <TextField
              margin="dense"
              id="medicineName"
              value={formValues.medicineName}
              label="Medicine Name"
              name="medicineName"
              required
              type="text"
              fullWidth
              variant="standard"
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="inStock"
              name="inStock"
              value={formValues.inStock}
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
                  icon={<StarBorderIcon />}
                  checkedIcon={<StarIcon />}
                  checked={formValues.isStar}
                  onChange={handleInputChange}
                  name="isStar"
                />
              }
              label="Star"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setFormValues({ medicineName: '', isStar: false, inStock: 0, notes: '', _id: '' })
                setOpen(false)
              }}
            >
              Cancel
            </Button>
            <LoadingButton variant="contained" type="submit" loadingPosition="start" loading={loading} startIcon={<SaveIcon />}>
              {menu._id === '' ? 'Save' : 'Update'}
            </LoadingButton>
          </DialogActions>
        </Box>
      </Dialog>
    </React.Fragment>
  )
}
