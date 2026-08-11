import ChatRoom from "../models/ChatRoomModel.js";
import Messages from "../models/MessageModel.js";



// @desc send messages 
const sendMessage = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { content, type = "text" } = req.body;
    const senderId = req.user._id;

    const room = await ChatRoom.findById(roomId);
    if (!room) return res.status(404).json({ msg: "Room not found" });

    const isParticipant = 
      room.buyer.toString() === senderId.toString() || 
      room.vendor.toString() === senderId.toString();
    if (!isParticipant) return res.status(403).json({ msg: "Not authorized" });

    const message = await Message.create({
      room: roomId,
      sender: senderId,
      content,
      type
    });

    const populatedMessage = await message.populate("sender", "name");

    await ChatRoom.findByIdAndUpdate(roomId, { 
      latestMessage: message._id,
      updatedAt: Date.now()
    });

    res.status(201).json(populatedMessage);
    
  } catch (error) {
    next(error);
  }
};



// @desc Find or create a chat room
const findOrCreateRoom = async (req, res, next) => {
  try {
    const { vendorId, productId } = req.body;
    const buyerId = req.user._id;

    let room = await ChatRoom.findOne({ product: productId, buyer: buyerId });

    if (!room) {
      room = await ChatRoom.create({
        product: productId,
        buyer: buyerId,
        vendor: vendorId,
      });
    }

    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};



// @desc Get all rooms for a user
const getRooms = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const chatRooms = await ChatRoom.find({
      $or: [{ buyer: userId }, { vendor: userId }],
    })
      .populate("product", "name images")
      .populate("latestMessage")
      .populate("buyer", "name")
      .populate("vendor", "name")
      .sort({ updatedAt: -1 });

    res.status(200).json(chatRooms);
  } catch (error) {
    next(error);
  }
};



// @desc Get messages for a room
const getMessages = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const messages = await Messages.find({ room: roomId })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};



export {sendMessage, findOrCreateRoom, getRooms, getMessages };