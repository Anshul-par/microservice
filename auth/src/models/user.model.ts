import { Schema, model, Document } from "mongoose";
import { hashPassword } from "../utility/password";

interface IUser extends Document {
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// ✅ Pre-save hook
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await hashPassword(this.password);
  next();
});

export const User = model<IUser>("user", userSchema);
