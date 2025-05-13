import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { id } = useParams();
  const targetUserId = id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const messagesEndRef = useRef(null); 

  const fetchChatMessages = async () => {
    try {
      console.log("📥 Fetching chat messages...");
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text } = msg;
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
        };
      });

      setMessages(chatMessages);
      console.log("✅ Chat messages loaded:", chatMessages);
    } catch (error) {
      console.error("❌ Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    console.log("🔌 Connecting socket...");

 
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    console.log("📢 joinChat event emitted:", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });


    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      console.log("📩 Message received from server:", { firstName, lastName, text });
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
    });

    return () => {
      console.log("❌ Disconnecting socket...");
      socket.disconnect();
    };
  }, [userId, targetUserId]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) {
      console.warn("⚠️ Cannot send an empty message!");
      return;
    }

    const socket = createSocketConnection();
    console.log("📢 Sending message:", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600">Chat</h1>

      <div className="flex-1 overflow-auto p-5">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              user.firstName === msg.firstName ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-header">
              {msg.firstName} {msg.lastName}
            </div>
            <div className="chat-bubble">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} /> 
      </div>

      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-500 text-white rounded p-2"
          placeholder="Type a message"
        />
        <button onClick={sendMessage} className="btn btn-secondary">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
