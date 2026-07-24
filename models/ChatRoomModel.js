import mongoose, {Schema} from "mongoose"



const ChatRoomSchema = new Schema({
  
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true,
    index: true 
  },
  
  buyer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  vendor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  
  // Track unread counts individually for the inbox list view
  buyerUnreadCount: { type: Number, default: 0 },
  
  vendorUnreadCount: { type: Number, default: 0 }
  
},
{ timestamps: true }
);

// Prevent duplicate rooms for the exact same buyer + product combination
ChatRoomSchema.index({ product: 1, buyer: 1 }, { unique: true });



export default mongoose.model('ChatRoom', ChatRoomSchema);

