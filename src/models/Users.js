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
    notes: String,
  },
  {
    timestamps: true,
  }
);

// usersSchema.pre("save", async function (next) {
//   try {
//     if (this.isNew) {
//       // Check if grNumber is null or undefined, set a default value
//       if (this.grNumber == null || typeof this.grNumber === "undefined") {
//         const lastUser = await this.constructor.findOne({ grNumber: { $ne: null } }, {}, { sort: { grNumber: -1 } });
//         this.grNumber = lastUser ? lastUser.grNumber + 1 : 1;
//       }
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

const Users = mongoose.models.Users || mongoose.model("Users", usersSchema);
export default Users;
