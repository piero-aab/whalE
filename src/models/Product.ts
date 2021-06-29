import mongoose, { model, Schema, Document, ObjectId, RefType } from "mongoose";
import {IUser} from "./User"
import {ICategory} from "./Category"
import  {ISubCategory} from "./SubCategory";

export interface IProduct extends Document {
  name: string;
  category: ICategory['_id'];
  subCategory: ISubCategory['_id'];
  basePrice: number;
  bankName: string;
  bankCCI: string;
  bankCC: string;
  price: number;
  type: string;
  description : string;
  images: [string];
  customer: IUser['_id'] ;
  buyer: IUser['_id'] ;
  saleDate: Date;
  preference_id:String;
  status: number;
};

const productSchema = new Schema <IProduct>({
  name: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" } ,
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" } ,
  basePrice: Number,
  bankName: { type: String },
  bankCCI: { type: String },
  bankCC: { type: String },
  price: Number,
  type: String,
  description : String,
  images: [String],
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" } ,
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" } ,
  saleDate: Date,
  //status: 0 no visible/ 1 visible/ 2 vendido/ 3 eliminado
  status: { type: Number, default: 0 },
}, { timestamps: true });

export default model<IProduct>("Product", productSchema);
