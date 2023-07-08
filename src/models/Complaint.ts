import { model, Schema, Document } from "mongoose";


export interface IComplaint extends Document {
  customerName: string;
  customerEmail: string;
  customerPhone: number;
  reason: string;
  details: string;
  answer: string;
  images: [string];
  status: number;
};

const complaintSchema = new Schema <IComplaint>({
  customerName: String,
  customerEmail: String,
  customerPhone: Number,
  reason: { type: String },
  details: { type: String },
  answer: { type: String },
  images: [String],
  //status: 0 no visible/ 1 visible/ 2 vendido/ 3 eliminado
  status: { type: Number, default: 0 },
}, { timestamps: true });

export default model<IComplaint>("Complaint", complaintSchema);
