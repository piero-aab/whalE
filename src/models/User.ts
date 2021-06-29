import mongoose,{ model, Schema, Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone: string;
  age: Date;
  bankData:{
    bankName: string;
    bankCCI: string;
    bankCC: string;
  },
  type: Number;
  sales: [ObjectId];
  purchases: [ObjectId];
  address : string;
  emailToken: string;
  expireToken: string;
  comparePassword: (password: string) => Promise<Boolean>
};

const userSchema = new Schema <IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  age: {
    type: Date,
    required: true
  },
  bankData:{
    bankName: { type: String },
    bankCCI: { type: String },
    bankCC: { type: String }
  },
  type :{ 
    type: Number, 
    enum: [0,1], 
    default: 0    
  },
  sales :[{ type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
  purchases :[{ type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
  emailToken :{
    type: String
  },
  expireToken :{
    type: String
  }
}, { timestamps: true });

userSchema.pre<IUser>("save", async function(next) {
  const user = this as IUser;

  if (!user.isModified("password")) return next();

  const hash = Buffer.from(encodeURIComponent(escape(user.password))).toString("base64")
  user.password = hash;

  next();
});

userSchema.methods.comparePassword = async function(password: string): Promise<Boolean> {
  if (password.length < 8) return false
  const hash = Buffer.from(encodeURIComponent(escape(password))).toString("base64")
  if(hash != this.password) return false
  return true
};

export default model<IUser>("User", userSchema);
