import Head from 'next/head'
import PlusIcon from '@heroicons/react/24/solid/PlusIcon'
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import React, { useEffect, useState } from 'react'
import AddMedicine from '@/components/AddMedicine'
import Checkbox from '@mui/material/Checkbox'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import Paper from '@mui/material/Paper'
import { useSnackbar } from 'notistack'

const Page = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [data, setData] = useState([])
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [menu, setMenu] = React.useState({ medicineName: '', isStar: '', inStock: 0, notes: '', _id: '' })
  useEffect(() => {
    GetData()
  }, [open])

  const GetData = async () => {
    setLoading(true)
    let headersList = {
      Accept: '*/*',
    }

    try {
      let response = await fetch('/api/medicine', {
        method: 'GET',
        headers: headersList,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      let responseData = await response.json()
      if (responseData.success) {
        const dataWithIds = responseData.Medicines.map((row, index) => ({
          ...row,
          id: index + 1,
        }))

        setData(dataWithIds)
        setLoading(false)
      } else {
        console.error(responseData)
        enqueueSnackbar('Soothing Wrong, Check Console or Contact to Hardik', { variant: 'error' })
      }
    } catch (error) {
      enqueueSnackbar('Soothing Wrong, Check Console or Contact to Hardik', { variant: 'error' })
      console.error('Error fetching data:', error)
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'medicineName',
      headerName: 'Medicine Name',
      width: 300,
      editable: true,
    },
    {
      field: 'isStar',
      headerName: 'is Star',
      width: 150,
      renderCell: (params) => (
        <Checkbox icon={<StarBorderIcon />} checkedIcon={<StarIcon color="error" />} checked={params.value} disabled />
      ),
    },
    {
      field: 'inStock',
      headerName: 'in Stock',
      width: 150,
      editable: true,
    },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 150,
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: (medicine) => {
        return [
          <GridActionsCellItem
            key={`edit-${medicine.id}`}
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditClick(medicine.row)}
            sx={{
              color: 'primary.main',
            }}
          />,
          <GridActionsCellItem
            key={`delete-${medicine.id}`}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(medicine.row)}
            sx={{
              color: 'error.main',
            }}
          />,
        ]
      },
    },
  ]

  const handleEditClick = (id) => {
    setMenu(id)
    setOpen(true)
  }
  const handleDeleteClick = async (row) => {
    if (confirm('are you sure to delete ' + row.medicineName + ' ?')) {
      let headersList = {
        Accept: '*/*',
      }

      let response = await fetch('/api/medicine?_id=' + row._id, {
        method: 'DELETE',
        headers: headersList,
      })

      let data = await response.json()
      if (data.success) {
        enqueueSnackbar('Record Deleted Successfully', { variant: 'info' })
        GetData()
      } else {
        console.error(data)
        enqueueSnackbar('Soothing Wrong, Check Console or Contact to Hardik', { variant: 'error' })
      }
    }
  }

  return (
    <>
      <Head>
        <title>Medicine</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#EFEFEF',
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Medicine</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  onClick={() => {
                    setMenu({ medicineName: '', isStar: '', inStock: 0, notes: '', _id: '' })
                    setOpen(true)
                  }}
                  variant="contained"
                >
                  New Medicine
                </Button>
              </div>
            </Stack>
            <Box sx={{ height: 450, width: '100%' }}>
              <Paper elevation={3}>
                <DataGrid
                  rows={data}
                  columns={columns}
                  loading={loading}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  autoHeight
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                    },
                  }}
                  pageSizeOptions={[5, 10, 50, 100]}
                  disableRowSelectionOnClick
                  editMode="false"
                />
              </Paper>
            </Box>
          </Stack>
        </Container>
      </Box>
      <AddMedicine open={open} setOpen={setOpen} menu={menu} />
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
