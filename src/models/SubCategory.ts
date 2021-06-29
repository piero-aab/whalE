import { model, Schema, Document } from "mongoose";

export interface ISubCategory extends Document {
  name: string;
  co2: number;
  carsRemovedxDay: number;
  cottonTshirt: number;
  savedWater: number;
  treeCo2xday : number;
};

const subCategorySchema = new Schema <ISubCategory>({
  name: {type:String},
  co2 : {type:Number},
  carsRemovedxDay: {type:Number},
  cottonTshirt : {type:Number},
  savedWater : {type:Number},
  treeCo2xday : {type:Number}
}, { timestamps: true });

export default model<ISubCategory>("SubCategory", subCategorySchema);
