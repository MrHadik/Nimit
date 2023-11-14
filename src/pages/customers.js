import Head from 'next/head'
import PlusIcon from '@heroicons/react/24/solid/PlusIcon'
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    GetData()
  })

  const GetData = async () => {
    let headersList = {
      Accept: '*/*',
    }

    let response = await fetch('/api/medicine', {
      method: 'GET',
      headers: headersList,
    })

    let responseData = await response.json()
    const dataWithIds = responseData.Medicines.map((row, index) => ({
      ...row,
      id: index + 1,
    }))
    setData(dataWithIds)
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'medicineName',
      headerName: 'Medicine Name',
      width: 150,
      editable: true,
    },
    {
      field: 'isStar',
      headerName: 'is Star',
      width: 150,
      editable: true,
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
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem key={`edit-${id}`} icon={<EditIcon />} label="Edit" onClick={() => handleEditClick(id)} color="inherit" />,
          <GridActionsCellItem key={`delete-${id}`} icon={<DeleteIcon />} label="Delete" onClick={() => handleDeleteClick(id)} color="inherit" />,
        ];
      },
    },
  ]

  const handleEditClick = (id) => {
    console.log(id)
    // console.log(id)
  }
  const handleDeleteClick = (id) => {
    console.log(id)
  }

  return (
    <>
      <Head>
        <title>Customers | Devias Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Users</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <DataGrid
              rows={data}
              columns={columns}
              // loading={true}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              slots={{ toolbar: GridToolbar }}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
            />
          </Stack>
        </Container>
      </Box>
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
