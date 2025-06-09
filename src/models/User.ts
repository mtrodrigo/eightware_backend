import { Schema, model, Document } from "mongoose";

interface User extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<User>(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export const User = model<User>("User", UserSchema);
