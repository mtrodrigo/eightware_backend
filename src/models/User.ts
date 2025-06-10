import { Schema, model, Document } from "mongoose";

export interface UserProps extends Document {
  name: string;
  email: string;
  password: string;
  cpf: string;
  address: string;
  number: string;
  city: string;
  state: string;
  zipcode: string;
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
    cpf: {
      type: String,
      require: true,
      unique: true,
    },
    address: {
      type: String,
      require: true,
    },
    number: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    state: {
      type: String,
      require: true,
    },
    zipcode: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export const User = model<UserProps>("User", UserSchema);
