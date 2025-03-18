"use client";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, Typography, Button, Modal, Checkbox } from "@mui/material";
import { useSnackbar } from 'notistack'

export default function BookingCalendar() {
  const { enqueueSnackbar } = useSnackbar()
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [bookings, setBookings] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [morning, setMorning] = useState(false);
  const [evening, setEvening] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("authenticated") === "true") {
      setIsAdmin(true);
    }

    async function fetchBookings() {
      try {
        setLoading(true);
        const res = await fetch(`/api/bookings`);
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [currentMonth]);

  const getDaysInMonth = () => {
    const startOfMonth = currentMonth.startOf("month");
    const days = [];
    const firstDayOfWeek = startOfMonth.day();

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= startOfMonth.daysInMonth(); i++) {
      days.push(startOfMonth.date(i));
    }
    return days;
  };

  const handleOpenModal = (date) => {
    const dateStr = date.format("YYYY-MM-DD");
    setSelectedDate(dateStr);
    setMorning(bookings[dateStr]?.morning || false);
    setEvening(bookings[dateStr]?.evening || false);
    setModalOpen(true);
  };

  const handleBookingSubmit = async () => {
    if (!selectedDate) return;

    if (!morning && !evening) {
      handleDeleteBooking();
      return;
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, morning, evening }),
      });

      if(res.ok){
        enqueueSnackbar('success', { variant: 'success' })
      } else {
        enqueueSnackbar('Soothing Wrong, Check Console or Contact to Hardik', { variant: 'error' })
      }
      setModalOpen(false);
      setBookings({ ...bookings, [selectedDate]: { morning, evening } });
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };

  const handleDeleteBooking = async () => {
    if (!selectedDate) return;

    try {
      const res = await fetch(`/api/bookings?date=${selectedDate}`, {
        method: "DELETE",
      });
      if(res.ok){
        enqueueSnackbar('Successfully Deleted!', { variant: 'success' })
      } else {
        enqueueSnackbar('Soothing Wrong, Check Console or Contact to Hardik', { variant: 'error' })
      }
      setModalOpen(false);
      const updatedBookings = { ...bookings };
      delete updatedBookings[selectedDate];
      setBookings(updatedBookings);
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "98.5vw", height: "100vh", p: 2, display: "flex", flexDirection: "column", bgcolor: "#f4f4f4" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>{currentMonth.format("MMMM YYYY")}</Typography>
          <Box>
            <Button variant="contained" onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))} sx={{ mx: 1, bgcolor: "blue", "&:hover": { bgcolor: "darkblue" } }}>
              ← Prev
            </Button>
            <Button variant="contained" onClick={() => setCurrentMonth(currentMonth.add(1, "month"))} sx={{ mx: 1, bgcolor: "blue", "&:hover": { bgcolor: "darkblue" } }}>
              Next →
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px", textAlign: "center", fontWeight: "bold", mb: 1 }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <Typography key={day} sx={{ fontSize: "16px", bgcolor: "#ddd", py: 1, borderRadius: "4px" }}>{day}</Typography>
          ))}
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px", flex: 1 }}>
          {loading ? (
            <Typography sx={{ textAlign: "center", width: "100%", mt: 5 }}>Loading...</Typography>
          ) : (
            getDaysInMonth().map((date, index) => {
              if (!date) return <Box key={index} sx={{ height: "100px", border: "1px solid transparent" }} />;
              const dateStr = date.format("YYYY-MM-DD");
              const isMorningBooked = bookings[dateStr]?.morning;
              const isEveningBooked = bookings[dateStr]?.evening;

              return (
                <Box
                  key={dateStr}
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    height: "100px",
                    position: "relative",
                    cursor: isAdmin ? "pointer" : "default",
                  }}
                  onClick={isAdmin ? () => handleOpenModal(date) : null}
                >
                  <Typography variant="body2" sx={{ position: "absolute", top: 2, left: 5, fontWeight: "bold", color: "white" }}>
                    {date.date()}
                  </Typography>
                  <Box sx={{ flex: 1, backgroundColor: isMorningBooked ? "red" : "green", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", color: "white" }}>
                    ☀️
                  </Box>
                  <Box sx={{ flex: 1, backgroundColor: isEveningBooked ? "red" : "green", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", color: "white" }}>
                    🌙
                  </Box>
                </Box>
              );
            })
          )}
        </Box>

        {/* Booking Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box sx={{ bgcolor: "white", p: 3, mx: "auto", my: "20vh", width: "400px", borderRadius: "8px" }}>
            <Typography variant="h6" mb={2}>Manage Booking for {selectedDate}</Typography>
            <Checkbox checked={morning} onChange={(e) => setMorning(e.target.checked)} label="Morning" />Morning
            <Checkbox checked={evening} onChange={(e) => setEvening(e.target.checked)} label="Evening" />Evening
            <Box>
            <Button variant="contained" onClick={handleBookingSubmit} sx={{ mt: 2 }}>Save Booking</Button>
            <Button variant="outlined" color="error" onClick={handleDeleteBooking} sx={{ mt: 2, ml: 1 }}>Clear Booking</Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </LocalizationProvider>
  );
}
