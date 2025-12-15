import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import {
  FaPaperPlane,
  FaUserCircle,
  FaSmileBeam,
} from "react-icons/fa";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5010";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

export default function ChatScreen() {
  const params = useParams();

  // Chat partner can be teacher or student
  const chatPartnerId = params.teacherId || params.studentId;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const bottomRef = useRef(null);

  // ============================
  // LOAD PREVIOUS MESSAGES
  // ============================
  useEffect(() => {
    if (!chatPartnerId) return;

    async function load() {
      const res = await api.get(`/chat/conversation/${chatPartnerId}`);
      setMessages(res.data);
    }

    load();
  }, [chatPartnerId]);

  // ============================
  // SOCKET REAL-TIME CHAT
  // ============================
  useEffect(() => {
    // Join user-specific room
    socket.emit("join-room", userId);

    // Listen to incoming messages
    socket.on("receive-message", (msg) => {
      const sender = String(msg.sender);
      const receiver = String(msg.receiver);
      const partner = String(chatPartnerId);

      // Only update chat if this message belongs to this conversation
      if (sender === partner || receiver === partner) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receive-message");
  }, [chatPartnerId, userId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ============================
  // SEND MESSAGE
  // ============================
  const sendMessage = async () => {
    if (!text.trim()) return;

    const payload = {
      receiverId: chatPartnerId,
      message: text,
    };

    const res = await api.post("/chat/send", payload);

    // Emit socket event
    socket.emit("send-message", res.data);

    // Add to local display
    setMessages((prev) => [...prev, res.data]);
    setText("");
  };

  // ============================
  // UI
  // ============================
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-pink-100 to-purple-100">

      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg flex items-center gap-3">
        <FaSmileBeam size={40} className="drop-shadow" />
        <div>
          <h1 className="text-2xl font-bold">Fun Chat 🎉</h1>
          <p className="text-sm opacity-80">Learn, talk & enjoy!</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMe = String(msg.sender) === String(userId);

          return (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && (
                <FaUserCircle className="text-purple-600" size={32} />
              )}

              <div
                className={`p-3 rounded-2xl max-w-xs text-sm shadow-md ${
                  isMe
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.message}

                <div className="text-[10px] opacity-70 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {isMe && (
                <FaUserCircle className="text-blue-600" size={32} />
              )}
            </motion.div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white flex items-center gap-3 shadow-inner">
        <input
          className="flex-1 border rounded-full px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Type something fun... 🎈"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all"
        >
          <FaPaperPlane size={20} />
        </button>
      </div>
    </div>
  );
}
