import ChatRoom from "../models/ChatRoomModel.js";
import Messages from "../models/MessageModel.js";



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



export { findOrCreateRoom, getRooms, getMessages };