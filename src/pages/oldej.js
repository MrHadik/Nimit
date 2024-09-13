import Head from 'next/head'
import PlusIcon from '@heroicons/react/24/solid/PlusIcon'
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import React, { useEffect, useState } from 'react'
import AddUsers from '@/components/AddUsers'
import CheckIcon from '@mui/icons-material/Check'
import Chip from '@mui/material/Chip'
import CloseIcon from '@mui/icons-material/Close'
import Paper from '@mui/material/Paper'
import { useSnackbar } from 'notistack'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const Page = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [data, setData] = useState([])
  const [active, setActive] = useState('all')
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [menu, setMenu] = React.useState({
    name: '',
    oldejHome: '',
    isActive: true,
    medicines: [],
    notes: '',
    _id: '',
    grNumber: 0,
    updatedAt: '',
    createdAt: '' })
  useEffect(() => {
    GetData()
  }, [open, active])

  const GetData = async () => {
    setLoading(true)

    try {
      let response = await fetch(active === 'active'? '/api/oldej?active=true': active === 'inactive'? '/api/oldej?active=false': '/api/oldej' )

      let responseData = await response.json()
      if (responseData.success) {
        const dataWithIds = responseData.allUser.map((row, index) => ({
          ...row,
          id: index + 1,
        }))

        setData(dataWithIds)
        setLoading(false)
      } else {
        console.error(responseData)
        enqueueSnackbar('Soothing Wrong, Check Console or Contact to Hardik', { variant: 'error' })
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      enqueueSnackbar('Soothing Wrong, Check Console or Contact to Hardik', { variant: 'error' })
      setLoading(false)
    }
  }

  const columns = [
    // { field: 'id', headerName: 'ID', width: 90 },
    { field: 'grNumber', headerName: 'GR Number', width: 130 },
    {
      field: 'name',
      headerName: 'Elder Name',
      width: 300,
    },
    {
      field: 'oldejHome',
      headerName: 'Oldej Home',
      width: 250,
    },
    {
      field: 'isActive',
      headerName: 'Active',
      width: 150,
      renderCell: (params) =>
        params.value ? (
          <Chip color="success" variant="outlined" size="small" label="Active" icon={<CheckIcon />} />
        ) : (
          <Chip color="error" variant="outlined" size="small" label="Not Active" icon={<CloseIcon />} />
        ),
    },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 200,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: (Users) => {
        return [
          <GridActionsCellItem
            key={`edit-${Users.id}`}
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditClick(Users.row)}
            sx={{
              color: 'primary.main',
            }}
          />,
          <GridActionsCellItem
            key={`delete-${Users.id}`}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(Users.row)}
            sx={{
              color: 'error.main',
            }}
          />,
        ]
      },
    },
  ]

  const handleEditClick = (row) => {
    setMenu(row)
    setOpen(true)
  }

  const handleDeleteClick = async (row) => {
    try {
      if (
        confirm(
          'Ruko Sabar karo.\nAre you sure to delete ' +
            row.name +
            ' ?\nafter Deleting this Elder will Permanent Delete in Database.',
        )
      ) {
        let response = await fetch('/api/oldej?_id=' + row._id, {
          method: 'DELETE',
        })

        let responseData = await response.json()
        if (responseData.success) {
          enqueueSnackbar('Record Deleted Successfully', { variant: 'info' })
          GetData()
        } else {
          console.error('Error fetching data:', responseData)
          enqueueSnackbar('Soothing Wrong, Check Console or Contact to Hardik', { variant: 'warning' })
        }
      }
    } catch (error) {
      enqueueSnackbar('Soothing Wrong, Check Console or Contact to Hardik', { variant: 'error' })
      console.error('Error fetching data:', error)
    }
  }

  return (
    <>
      <Head>
        <title>Elders</title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: '#EFEFEF',
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Elders List</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  onClick={() => {
                    setMenu({
                      name: '',
                      oldejHome: '',
                      isActive: true,
                      medicines: [],
                      notes: '',
                      _id: '',
                      grNumber: 0,
                      updatedAt: '',
                      createdAt: '' })
                    setOpen(true)
                  }}
                  variant="contained"
                >
                  New Elder
                </Button>
              </div>
            </Stack>
            <div style={{display: 'flex', justifyContent: 'center'}}>
            <RadioGroup
                  row
                  aria-label="Filter Elders"
                  name="row-radio-buttons-group"
                  value={active}
                  onChange={(e) => setActive(e.target.value)}
                >
                  <FormControlLabel value="active" control={<Radio />}  label="Active" />
                  <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
                  <FormControlLabel value="all" control={<Radio />} label="All"/>
                  </RadioGroup>
            </div>
            <Box sx={{ height: 450, width: '100%' }}>
              <Paper elevation={3}>
                <DataGrid
                  rows={data}
                  columns={columns}
                  loading={loading}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 10,
                      },
                    },
                  }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                    },
                  }}
                  autoHeight
                  slots={{ toolbar: GridToolbar }}
                  disableColumnFilter
                  disableColumnSelector
                  disableDensitySelector
                  pageSizeOptions={[5, 10, 50, 100]}
                  rowHeight={40}
                  disableRowSelectionOnClick
                  editMode="false"
                />
              </Paper>
            </Box>
          </Stack>
        </Container>
      </Box>
      <AddUsers open={open} setOpen={setOpen} menu={menu} />
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
