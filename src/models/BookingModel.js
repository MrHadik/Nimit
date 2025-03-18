  import mongoose from "mongoose";

  const BookingSchema = new mongoose.Schema({
    date: { type: String, required: true }, // Format: "YYYY-MM-DD" (for one-time bookings)
    morning: { type: Boolean, default: false }, // Morning slot availability
    evening: { type: Boolean, default: false }, // Evening slot availability
    repeatEveryYear: { type: Boolean, default: false }, // True = Recurring booking every year
    repeatEveryWeek: { type: String, enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], default: null }, // Weekly recurring booking
  });

  const BookingModel = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

  export default BookingModel;
