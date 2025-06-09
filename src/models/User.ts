import { Schema, model, Document } from "mongoose";

export interface UserProps extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<UserProps>(
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

export const User = model<UserProps>("User", UserSchema);
