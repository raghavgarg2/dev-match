// const socket = require("socket.io");

// const initializeSocket = (server) => {
//   const io = socket(server, {
//     cors: {
//       origin: "http://localhost:5173",
//     },
//   });

//   io.on("connection", (socket) => {
//     socket.on("joinChat", ({ userId, targetUserId }) => {
//       const roomId = [userId, targetUserId].sort().join("_");
//       socket.join(roomId);
//     });

//     socket.on("sendMessage", ({ firstname, userId, targetUserId, text }) => {
//       const roomId = [userId, targetUserId].sort().join("_");
//       io.to(roomId).emit("newMessage", { firstname, text }); // whatever message server has received from frontend has now to be transfered to that particular room that it is intended for for that we use io.to and .emit means server is sending a message
//     });

//     socket.on("disconnect", () => {});
//   });
// };

// module.exports = initializeSocket;

// const socket = require("socket.io");
// const crypto = require("crypto");
// const { Chat } = require("../models/chat");
// const ConnectionRequest = require("../models/connectionRequest");

// const getSecretRoomId = (userId, targetUserId) => {
//   return crypto
//     .createHash("sha256")
//     .update([userId, targetUserId].sort().join("$"))
//     .digest("hex");
// };

// const initializeSocket = (server) => {
//   const io = socket(server, {
//     cors: {
//       origin: ["http://localhost:5173", "https://dev-match.vercel.app"],
//       credentials: true,
//     },
//   });

//   io.on("connection", (socket) => {
//     socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
//       const roomId = getSecretRoomId(userId, targetUserId);
//       // console.log(firstName + " joined Room : " + roomId);
//       socket.join(roomId);
//     });

//     socket.on(
//       "sendMessage",
//       async ({ firstName, lastName, userId, targetUserId, text }) => {
//         // Save messages to the database
//         try {
//           const roomId = getSecretRoomId(userId, targetUserId);
//           // console.log(firstName + " " + text);

//           // TODO: Check if userId & targetUserId are friends

//           let chat = await Chat.findOne({
//             participants: { $all: [userId, targetUserId] },
//           });

//           if (!chat) {
//             chat = new Chat({
//               participants: [userId, targetUserId],
//               messages: [],
//             });
//           }

//           chat.messages.push({
//             senderId: userId,
//             text,
//           });

//           await chat.save();
//           io.to(roomId).emit("messageReceived", { firstName, lastName, text });
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     );

//     socket.on("disconnect", () => {});
//   });
// };

// module.exports = initializeSocket;
const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: ["http://localhost:5173", "https://dev-match.vercel.app"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔥 Client connected: ${socket.id}`);

    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(`📌 ${firstName} joined Room: ${roomId}`);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(`📩 ${firstName} sending message in Room: ${roomId}`);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
          console.log(`✅ Message sent in Room: ${roomId}`);
        } catch (err) {
          console.error("❌ Error in sendMessage:", err);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = initializeSocket;
