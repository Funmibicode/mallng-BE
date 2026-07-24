import Message from "../models/MessageModel.js";
import ChatRoom from "../models/ChatRoomModel.js";


const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { roomId, senderId, content } = data;

        const message = await Message.create({
          room: roomId,
          sender: senderId,
          content,
        });

        await ChatRoom.findByIdAndUpdate(roomId, {
          latestMessage: message._id,
        });

        io.to(roomId).emit("newMessage", message);
      } catch (error) {
        console.error("Message save error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};


export default chatSocket;