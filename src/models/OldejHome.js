import mongoose, { Schema } from 'mongoose';

const OldejHomeSchema = new Schema(
  {
    OldejHome: {
      type: String,
      unique: true,
      required: true, // Note: It should be 'required' instead of 'require'
    },
    notes: String,
  },
  {
    timestamps: true, // Note: It should be 'timestamps' instead of 'timeStamp'
  }
);

const OldejHome = mongoose.models.OldejHome || mongoose.model('OldejHome', OldejHomeSchema);
export default OldejHome;
