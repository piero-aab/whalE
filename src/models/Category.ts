import  mongoose ,{ model, Schema, Document, ObjectId } from 'mongoose';
import  {ISubCategory} from "./SubCategory";

export interface ICategory extends Document {
  name: string;
  subcategories: [ISubCategory['_id']];
};

const categorySchema = new Schema <ICategory>({
  name: String,
  subcategories : [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "SubCategory" 
  }]
}, { timestamps: true });

export default model<ICategory>("Category", categorySchema);
