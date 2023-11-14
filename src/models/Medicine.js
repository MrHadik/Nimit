import mongoose, { Schema } from 'mongoose';

const medicineSchema = new Schema(
  {
    medicineName: {
      type: String,
      unique: true,
      required: true, // Note: It should be 'required' instead of 'require'
    },
    isStar: {
      type: Boolean,
      required: true,
    },
    inStock: Number,
    notes: String,
  },
  {
    timestamps: true, // Note: It should be 'timestamps' instead of 'timeStamp'
  }
);

const Medicines = mongoose.models.Medicines || mongoose.model('Medicines', medicineSchema);
export default Medicines;
