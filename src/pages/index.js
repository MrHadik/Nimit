import Head from 'next/head'
import { Box, Container, Stack, Typography } from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import Paper from '@mui/material/Paper'

const Page = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    GetData()
  }, [])

  const GetData = async () => {
    setLoading(true)
    try {
      const RawResponse1 = await fetch('/api/medicine?status=true')
      const response1 = await RawResponse1.json()
      const RawResponse2 = await fetch('/api/medicine')
      const response2 = await RawResponse2.json()

      const isStarMap = {}
      response2.Medicines.forEach((medicine) => {
        isStarMap[medicine.medicineName] = medicine.isStar
      })

      response1.Medicines.forEach((medicine) => {
        const { medicineName } = medicine
        // eslint-disable-next-line no-prototype-builtins
        if (isStarMap.hasOwnProperty(medicineName)) {
          medicine.isStar = isStarMap[medicineName]
        }
      })
      setData(response1.Medicines)
      setLoading(false)
    } catch (error) {
      alert(error)
      console.error('Error fetching data:', error)
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'medicineName',
      headerName: 'Medicine Name',
      width: 300,
    },
    {
      field: 'quantity',
      headerName: 'Total Quantity',
      width: 150,
    },
    {
      field: 'isStar',
      headerName: 'Star',
      width: 150,
      renderCell: (params) => (
        <Checkbox icon={<StarBorderIcon />} checkedIcon={<StarIcon color="error" />} checked={params.value} disabled />
      ),
    },
  ]

  return (
    <>
      <Head>
        <title>Total Medicines</title>
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
                <Typography variant="h4">Total Medicines</Typography>
              </Stack>
            </Stack>
            <Box sx={{ height: 450, width: '100%' }}>
              <Paper elevation={3}>
                <DataGrid
                  rows={data}
                  autoHeight
                  columns={columns}
                  loading={loading}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                    },
                  }}
                  slots={{ toolbar: GridToolbar }}
                  disableColumnFilter
                  disableColumnSelector
                  disableDensitySelector
                  pageSizeOptions={[5, 10, 50, 100]}
                  disableRowSelectionOnClick
                  editMode="false"
                  rowHeight={30}
                />
              </Paper>
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
