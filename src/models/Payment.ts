import { model, Schema, Document, ObjectId } from "mongoose";
import mongoose from "mongoose";
import IUser from "./User"

export interface IPayment extends Document {
  product: ObjectId;
  buyer: typeof IUser;
  contact:{
    address : String,
    phone : String,
    deliveryType: String
  },
  saleDate: Date;
  preference_id:String;
  payment_id:string;
  status: number;
};

const paymentSchema = new Schema <IPayment>({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" } ,
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" } ,
  contact:{
    address : String,
    phone : String,
    deliveryType: String
  },
  saleDate: Date,
  preference_id:String,
  payment_id:String,
  //status 0: pendiente, status:1 exito
  status: { type: Number, enum: [0,1], default: 0 },
}, { timestamps: true });

export default model<IPayment>("Payment", paymentSchema);