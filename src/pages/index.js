import Head from 'next/head'
import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { Box, Container, Stack, Typography, Paper } from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import Checkbox from '@mui/material/Checkbox'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import { useSnackbar } from 'notistack'

const Page = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [response1, response2] = await Promise.all([
          fetch('/api/medicine?status=true').then((res) => res.json()),
          fetch('/api/medicine').then((res) => res.json()),
        ])

        if (!response1.success || !response2.success) {
          console.error('Error fetching data:', response1)
          console.error('Error fetching data:', response2)
          enqueueSnackbar('Something went wrong. Please check the console or contact Hardik.', { variant: 'error' })
          return
        }

        const isStarMap = {}
        response2.Medicines.forEach((medicine) => {
          isStarMap[medicine.medicineName] = medicine.isStar
        })

        const updatedMedicines = response1.Medicines.map((medicine) => {
          // eslint-disable-next-line no-prototype-builtins
          if (isStarMap.hasOwnProperty(medicine.medicineName)) {
            return { ...medicine, isStar: isStarMap[medicine.medicineName] }
          }
          return medicine
        })

        setData(updatedMedicines)
        setLoading(false)
      } catch (error) {
        enqueueSnackbar('Something went wrong. Please check the console or contact Hardik.', { variant: 'error' })
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [enqueueSnackbar])

  const columns = useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'medicineName', headerName: 'Medicine Name', width: 300 },
      { field: 'quantity', headerName: 'Total Quantity', width: 150 },
      {
        field: 'isStar',
        headerName: 'Star',
        width: 150,
        renderCell: (params) => (
          <Checkbox
            icon={<StarBorderIcon />}
            checkedIcon={<StarIcon color="error" />}
            checked={params.value}
            disabled
          />
        ),
      },
    ],
    [],
  )

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
                        pageSize: 10,
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
                  pageSizeOptions={[5, 10, 50, 100]}
                  disableRowSelectionOnClick
                  editMode={false}
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
