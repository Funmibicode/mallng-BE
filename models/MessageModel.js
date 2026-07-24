import mongoose, {Schema} from "mongoose"



const messageSchema = new Schema({
  room: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ChatRoom', 
    required: true,
    index: true 
  },
  
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  content: {
    type: String, 
    required: true, 
    trim: true 
  },
  
  messageType: { 
    type: String, 
    enum: ['text', 'image', ],
    default: 'text' 
  },
  
  isRead: { 
    type: Boolean, 
    default: false 
  }
}, 
  { timestamps: true }
);



export default mongoose.model('Messages', messageSchema);