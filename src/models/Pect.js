import mongoose, { Schema } from "mongoose";

const pectSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    message: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    lastBalance: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Pect = mongoose.models.Pect || mongoose.model("Pect", pectSchema);
export default Pect;
