import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { Box, Stack, CircularProgress, Container } from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { useSnackbar } from 'notistack'

function Print() {
  const { enqueueSnackbar } = useSnackbar()
  const [oldejHomeList, setOldejHomeList] = useState([])
  const [oldejHomeName, setOldejHomeName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getList()
  }, [])

  const handleInputChange = (event, value) => {
    setOldejHomeName(value)
  }

  const getList = async () => {
    try {
      setLoading(true)
      let response = await fetch('/api/oldejHome')
      let responseData = await response.json()

      if (responseData.success) {
        setOldejHomeList(responseData.allOldejHome)
      }
    } catch (error) {
      alert(error)
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadPdf = async () => {
    try {
      setLoading(true)
      let response = await fetch('/api/pdf?oldejHome=' + oldejHomeName)
      let responseData = await response.json()

      if (!responseData.success) {
        enqueueSnackbar('Something Wrong', { variant: 'error' })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Print</title>
      </Head>
      <Box
        sx={{
          backgroundColor: '#EFEFEF',
          flex: '1 1 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="sm">
        <Paper elevation={3} sx={{padding: 5}}>
          <Stack spacing={3}>
            <Autocomplete
              fullWidth
              disablePortal
              id="combo-box-demo"
              options={oldejHomeList.map((obj) => obj.OldejHome)}
              value={oldejHomeName}
              onChange={handleInputChange}
              renderInput={(params) => <TextField {...params} label="Oldej Home" />}
            />
            <Button fullWidth onClick={downloadPdf} size="large" disabled={loading} variant="contained">
              {loading ? <CircularProgress size={24} /> : 'Download PDF'}
            </Button>
          </Stack>
        </Paper>
        </Container>
      </Box>
    </>
  )
}

Print.getLayout = (print) => <DashboardLayout>{print}</DashboardLayout>

export default Print
