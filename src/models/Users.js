import mongoose, { Schema } from "mongoose";

const usersSchema = new Schema(
  {
    grNumber: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    oldejHome: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    medicines: {
      type: Array,
      required: true,
    },
    attendees: {
      type: Array
    },
    notes: String
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.models.Users || mongoose.model("Users", usersSchema);
export default Users;
