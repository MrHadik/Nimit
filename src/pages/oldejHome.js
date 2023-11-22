import Head from 'next/head'
import PlusIcon from '@heroicons/react/24/solid/PlusIcon'
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import React, { useEffect, useState } from 'react'
import AddOldejHome from '@/components/AddOldejHome'
import Paper from '@mui/material/Paper'
import { useSnackbar } from 'notistack'

const Page = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [data, setData] = useState([])
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [menu, setMenu] = React.useState({ OldejHome: '', notes: '', _id: '' })
  useEffect(() => {
    GetData()
  }, [open])

  const GetData = async () => {
    setLoading(true)

    try {
      let response = await fetch('/api/oldejHome')

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      let responseData = await response.json()
      if (responseData.success) {
        const dataWithIds = responseData.allOldejHome.map((row, index) => ({
          ...row,
          // isStar: row.isStar ? <Chip label="success" color="success" /> : <Chip label="primary" color="primary" />,
          id: index + 1,
        }))

        setData(dataWithIds)
        setLoading(false)
      }
    } catch (error) {
      alert(error)
      console.error('Error fetching data:', error)
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'OldejHome',
      headerName: 'Oldej Home',
      width: 300,
      editable: true,
    },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 250,
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: (Home) => {
        return [
          <GridActionsCellItem
            key={`edit-${Home.id}`}
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditClick(Home.row)}
            sx={{
              color: 'primary.main',
            }}
          />,
          <GridActionsCellItem
            key={`delete-${Home.id}`}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(Home.row)}
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
    if (confirm('are you sure to delete ' + row.OldejHome + ' ?')) {
      let response = await fetch('/api/oldejHome?_id=' + row._id, {
        method: 'DELETE',
      })

      const data = await response.json()
      data.success
        ? enqueueSnackbar('Record Deleted successfully', { variant: 'success' })
        : enqueueSnackbar(data, { variant: 'error' })

      GetData()
    }
  }

  return (
    <>
      <Head>
        <title>Oldej Home</title>
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
                <Typography variant="h4">Oldej Home</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  onClick={() => {
                    setMenu({ OldejHome: '', notes: '', _id: '' })
                    setOpen(true)
                  }}
                  variant="contained"
                >
                  Add
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
                  pageSizeOptions={[5, 10, 50, 100]}
                  disableRowSelectionOnClick
                  editMode="false"
                />
              </Paper>
            </Box>
          </Stack>
        </Container>
      </Box>
      <AddOldejHome open={open} setOpen={setOpen} menu={menu} />
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
