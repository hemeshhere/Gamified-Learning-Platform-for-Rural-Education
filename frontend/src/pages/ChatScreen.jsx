import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import {
  FaPaperPlane,
  FaUserCircle,
  FaSmile,
} from "react-icons/fa";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5010";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

export default function ChatScreen() {
  const params = useParams();
  const chatPartnerId = params.teacherId || params.studentId;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [partnerName, setPartnerName] = useState("Chat");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const bottomRef = useRef(null);

  /* Load messages + partner name */
  useEffect(() => {
    if (!chatPartnerId) return;

    async function load() {
      const res = await api.get(`/chat/conversation/${chatPartnerId}`);
      setMessages(res.data);

      // Fetch teacher / student name
      const partnerRes = await api.get(`/users/${chatPartnerId}`);
      setPartnerName(partnerRes.data.name);
    }

    load();
  }, [chatPartnerId]);

  /* Socket */
  useEffect(() => {
    socket.emit("join-room", userId);

    socket.on("receive-message", (msg) => {
      if (
        String(msg.sender) === String(chatPartnerId) ||
        String(msg.receiver) === String(chatPartnerId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receive-message");
  }, [chatPartnerId, userId]);

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Send message */
  const sendMessage = async () => {
    if (!text.trim()) return;

    const res = await api.post("/chat/send", {
      receiverId: chatPartnerId,
      message: text,
    });

    socket.emit("send-message", res.data);
    setMessages((prev) => [...prev, res.data]);
    setText("");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden 
                    bg-gradient-to-br from-sky-100 via-pink-100 to-purple-100">

      {/* HEADER */}
      <div className="shrink-0 px-6 py-4 
                      bg-gradient-to-r from-purple-500 to-pink-500 
                      text-white shadow-md flex items-center gap-4">
        <FaUserCircle size={36} />
        <div>
          <h1 className="text-2xl font-bold">{partnerName}</h1>
          <p className="text-sm opacity-90">
            Say hello 👋 and ask your doubts
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        {messages.map((msg) => {
          const isMe = String(msg.sender) === String(userId);

          return (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${isMe ? "justify-end" : "justify-start"} gap-3`}
            >
              {!isMe && (
                <FaUserCircle size={34} className="text-purple-400" />
              )}

              <div
                className={`max-w-[75%] px-5 py-3 rounded-3xl 
                            text-base shadow-md leading-relaxed
                  ${isMe
                    ? "bg-blue-500 text-white rounded-br-lg"
                    : "bg-white text-gray-800 rounded-bl-lg"}
                `}
              >
                {msg.message}
                <div className="text-xs opacity-60 mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {isMe && (
                <FaUserCircle size={34} className="text-blue-500" />
              )}
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="shrink-0 px-5 py-4 bg-white shadow-inner 
                      flex items-center gap-4">

        {/* Emoji button */}
        <button
          onClick={() => setText((prev) => prev + " 😊")}
          className="text-yellow-400 text-2xl hover:scale-110 transition"
          title="Add emoji"
        >
          <FaSmile />
        </button>

        <input
          className="flex-1 px-5 py-3 rounded-full border text-base
                     focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Type your message here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-gradient-to-r from-pink-500 to-purple-600 
                     text-white px-5 py-3 rounded-full 
                     shadow-lg hover:scale-105 transition"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
