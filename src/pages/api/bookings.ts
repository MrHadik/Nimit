// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectMongoDB from "@/lib/mongodb";
import BookingModel from "@/models/BookingModel";

connectMongoDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET":
        await handleGetRequest(req, res);
        break;

      case "POST":
        await handlePostRequest(req, res);
        break;

      // case "PUT":
      //   await handlePutRequest(req, res);
      //   break;

      case "DELETE":
        await handleDeleteRequest(req, res);
        break;

      default:
        res.status(400).json({ error: "Method not allowed", success: false });
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, success: false });
  }
}


async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Current month (1-12)

    // Get the first day of the current month
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).toISOString().split("T")[0];

    // Check if today is the 1st of the month (start of a new month)
    if (currentDate.getDate() === 1) {
      // Delete all one-time bookings from the last month
      await BookingModel.deleteMany({
        date: { $lt: firstDayOfMonth }, // Only delete records from previous months
        repeatEveryYear: false,
        repeatEveryWeek: null,
      });

      console.log("Old one-time bookings deleted for the new month.");
    }

    // Fetch all bookings
    const bookings = await BookingModel.find({});

    // Process bookings
    const formattedBookings = {};
    bookings.forEach((booking) => {
      const { date, morning, evening, repeatEveryYear, repeatEveryWeek } = booking;
      const [month, day] = date.split("-");

      if (repeatEveryYear) {
        // Add yearly recurring booking
        const thisYearDate = `${currentYear}-${month}-${day}`;
        formattedBookings[thisYearDate] = { morning, evening };
      } else if (repeatEveryWeek) {
        // Add weekly recurring booking for every matching weekday in the current month
        const startDate = new Date(currentYear, currentMonth - 1, 1);
        while (startDate.getMonth() + 1 === currentMonth) {
          if (startDate.toLocaleDateString("en-US", { weekday: "long" }) === repeatEveryWeek) {
            const formattedDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;
            formattedBookings[formattedDate] = { morning, evening };
          }
          startDate.setDate(startDate.getDate() + 1);
        }
      } else {
        // Add one-time booking
        formattedBookings[date] = { morning, evening };
      }
    });

    return res.json(formattedBookings);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching bookings" });
  }
}



async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { date, morning, evening, repeatEveryYear, repeatEveryWeek } = await req.body

    // Save new booking
    const newBooking = new BookingModel({ date, morning, evening, repeatEveryYear, repeatEveryWeek  });
    await newBooking.save();

    return  res.json({ message: "Booking saved successfully!" });
  } catch (error) {
    console.log(error)
    return  res.json({ message: "Error saving booking" });
  }
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }
    await BookingModel.deleteOne({ date });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting booking" });
  }
}