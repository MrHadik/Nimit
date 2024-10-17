import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Box, Stack, Container, CircularProgress, Button, Paper, TextField, Table, TableBody, TableCell,
  TableContainer, SvgIcon, TableHead, TableRow, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle
} from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useSnackbar } from 'notistack';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

function Pect() {
  const [allRecordList, setAllRecordList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [record, setRecord] = useState({ date: new Date(), message: '', amount: 0, lastBalance: 0 });
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pect');
      const responseData = await response.json();

      if (responseData.success) {
        setAllRecordList(responseData.records);
        setBalance(responseData.balance);
      }
    } catch (error) {
      enqueueSnackbar('Error fetching records', { variant: 'error' });
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (newDate) => {
    setRecord((prev) => ({ ...prev, date: newDate }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRecord = async () => {
    if (record.amount !== 0) {
      setLoading(true);
      setRecord(record.lastBalance = balance);
      const bodyContent = JSON.stringify(record);
      const headersList = {
        Accept: '*/*',
        'Content-Type': 'application/json',
      };

      try {
        const response = await fetch('/api/pect', {
          method: 'POST',
          body: bodyContent,
          headers: headersList,
        });

        const responseData = await response.json();
        if (responseData.success) {
          enqueueSnackbar('Record added successfully', { variant: 'success' });
          setRecord({ date: new Date(), message: '', amount: 0, lastBalance: 0 });
          getList();
        } else {
          enqueueSnackbar('Failed to add record', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('Error adding record', { variant: 'error' });
        console.error('Error adding record:', error);
      } finally {
        setLoading(false);
      }
    } else {
      enqueueSnackbar('Enter Date and Amount', { variant: 'error' });
    }
  };

  const handleDeleteRecord = async (id) => {
    try {
      const response = await fetch(`/api/pect?_id=${id}`, {
        method: 'DELETE',
      });
      const responseData = await response.json();
      if (responseData.success) {
        enqueueSnackbar('Record Deleted successfully', { variant: 'success' });
        getList();
      } else {
        enqueueSnackbar('Failed to delete record', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error deleting record', { variant: 'error' });
      console.error('Error deleting record:', error);
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleClearRecord = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/pect?clear=true`, {
        method: 'DELETE',
      });
      const responseData = await response.json();
      if (responseData.success) {
        enqueueSnackbar('Records cleared successfully', { variant: 'success' });
        getList();
        handleCloseDialog();
      } else {
        enqueueSnackbar('Failed to clear records', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error clearing records', { variant: 'error' });
      console.error('Error clearing records:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>PECT</title>
      </Head>
      <Box
        sx={{
          backgroundColor: '#EFEFEF',
          flex: '1 1 auto',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="md">
          <Paper sx={{ padding: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ marginRight: '20px' }}>Balance: </h3>
            <h1>{new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 0
            }).format(balance)}
            </h1>
          </Paper>
          <Paper elevation={3} sx={{ padding: 5, marginTop: 2 }}>
            <Stack spacing={3}>
              <MobileDatePicker
                label="Select date"
                value={record.date}
                onChange={handleDateChange}
                inputFormat="dd/MM/yyyy"
                renderInput={(params) => <TextField {...params} />}
              />
              <TextField
                name="message"
                aria-label="Message input"
                multiline
                minRows={3}
                label="Message"
                placeholder="Type something…"
                value={record.message}
                onChange={handleInputChange}
              />
              <TextField
                name="amount"
                label="Amount"
                type="number"
                aria-label="Amount input"
                placeholder="0"
                value={record.amount}
                onChange={handleInputChange}
              />
              <Button onClick={handleAddRecord} fullWidth size="sm" disabled={loading} variant="contained">
                {loading ? <CircularProgress size={24} /> : 'Add Record'}
              </Button>
            </Stack>
          </Paper>

          {allRecordList.length > 0 && (
            <Paper elevation={3} sx={{ padding: 5, marginY: 2 }}>
              <Button
                sx={{ marginBottom: 2 }}
                onClick={handleOpenDialog}
                color='error'
                fullWidth
                size="sm"
                disabled={loading}
                variant="outlined"
              >
                Clear Records
              </Button>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell sx={{ width: '40%' }}>Message</TableCell>
                      <TableCell>Balance</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allRecordList.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{new Date(record.date).toLocaleDateString('in')}</TableCell>
                        <TableCell>{record.message}</TableCell>
                        <TableCell>{new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          minimumFractionDigits: 0
                        }).format(record.lastBalance)}
                        </TableCell>
                        <TableCell>{new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          minimumFractionDigits: 0
                        }).format(record.amount)}
                        </TableCell>
                        <TableCell>
                          <Button color='error' size="sm" onClick={() => handleDeleteRecord(record._id)}>
                            <SvgIcon color='red' fontSize="small">
                              <TrashIcon />
                            </SvgIcon>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* Clear Records Confirmation Dialog */}
          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>Clear Records</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to clear all records? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
              <Button onClick={handleClearRecord} color="error">Clear Records</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
}

Pect.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Pect;
