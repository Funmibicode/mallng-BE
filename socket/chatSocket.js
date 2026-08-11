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
        const { roomId, senderId, content, type = "text" } = data; 

        const room = await ChatRoom.findById(roomId);
        if (!room) return;

        const isParticipant = 
          room.buyer.toString() === senderId.toString() || 
          room.vendor.toString() === senderId.toString();
        if (!isParticipant) return;

        const message = await Message.create({
          room: roomId,
          sender: senderId,
          content,
          type // text, image, file
        });

        const populatedMessage = await message.populate("sender", "name");

        await ChatRoom.findByIdAndUpdate(roomId, {
          latestMessage: message._id,
          updatedAt: Date.now()
        });

        io.to(roomId).emit("newMessage", populatedMessage);
        
      } catch (error) {
        console.error("Message save error:", error);
        socket.emit("error", { msg: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default chatSocket;