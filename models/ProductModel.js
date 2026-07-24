import mongoose, { Schema } from "mongoose"



const productSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    cloudinaryIds: [
      {
        type: String,
      },
    ],
    status: { 
      type: String, 
      enum: ['active', 'sold', 'archived'], 
      default: 'active' 
    },
  },
  
  {
    timestamps: true,
  }
);




export default mongoose.model("Product", productSchema);



  
