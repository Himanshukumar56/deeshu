import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { Trash2, Mic, StopCircle } from "lucide-react";

const Chat = ({ partnerId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [partnerIsTyping, setPartnerIsTyping] = useState(false);
  const [partnerData, setPartnerData] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef(null);
  const chatContainerRef = useRef(null);

  const chatId = [user.uid, partnerId].sort().join("_");

  useEffect(() => {
    const fetchPartnerData = async () => {
      const userDocRef = doc(db, "users", partnerId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setPartnerData(userDocSnap.data());
      }
    };

    if (partnerId) {
      fetchPartnerData();
    }
  }, [partnerId]);

  useEffect(() => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    const chatRef = collection(db, "chats");
    const q = query(chatRef, where("users", "==", chatId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.typingStatus && data.typingStatus.userId !== user.uid) {
          setPartnerIsTyping(data.typingStatus.isTyping);
        }
      });
    });

    return () => unsubscribe();
  }, [chatId, user.uid]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      text: newMessage,
      senderId: user.uid,
      senderName: user.displayName,
      timestamp: serverTimestamp(),
      seen: false,
    });

    setNewMessage("");
    handleTyping(false);
  };

  const handleAudioUpload = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        if (chunks.length === 0) return;
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const audioURL = await handleAudioUpload(audioBlob);

        const messagesRef = collection(db, "chats", chatId, "messages");
        await addDoc(messagesRef, {
          type: "audio",
          audioURL: audioURL,
          senderId: user.uid,
          senderName: user.displayName,
          timestamp: serverTimestamp(),
          seen: false,
        });
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 100);
      }, 100);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
      setRecordingTime(0);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const messageRef = doc(db, "chats", chatId, "messages", messageId);
    await deleteDoc(messageRef);
  };

  const handleTyping = async (isTyping) => {
    const chatRef = collection(db, "chats");
    const chatDocRef = (
      await getDocs(query(chatRef, where("users", "==", chatId)))
    ).docs[0]?.ref;

    if (chatDocRef) {
      await updateDoc(chatDocRef, {
        typingStatus: {
          userId: user.uid,
          isTyping: isTyping,
        },
      });
    } else {
      await addDoc(chatRef, {
        users: chatId,
        typingStatus: {
          userId: user.uid,
          isTyping: isTyping,
        },
      });
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      handleTyping(true);
    }
    // Reset typing status after a delay
    setTimeout(() => {
      setIsTyping(false);
      handleTyping(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center border-b border-rose-100 dark:border-gray-700">
        {partnerData?.photoURL ? (
          <img
            src={partnerData.photoURL}
            alt={partnerData.displayName}
            className="w-10 h-10 rounded-full mr-4"
          />
        ) : (
          <div className="w-10 h-10 rounded-full mr-4 bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {partnerData?.displayName?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {partnerData?.displayName || "Chat"}
        </h2>
      </div>
      <div
        className="flex-1 overflow-y-auto p-6 space-y-6"
        ref={chatContainerRef}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-3 ${
              msg.senderId === user.uid ? "justify-end" : "justify-start"
            }`}
          >
            {msg.senderId !== user.uid && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {msg.senderName?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div
              className={`rounded-2xl p-4 max-w-md ${
                msg.senderId === user.uid
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-br-none"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-sm mb-1">{msg.senderName}</div>
                  {msg.type === "audio" ? (
                    <audio controls src={msg.audioURL} />
                  ) : (
                    <p className="text-base">{msg.text}</p>
                  )}
                </div>
                {msg.senderId === user.uid && (
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="text-white/50 hover:text-white ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="text-xs text-right mt-2 opacity-70">
                {msg.timestamp?.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            {msg.senderId === user.uid && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {msg.senderName?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        ))}
        {partnerIsTyping && (
          <div className="text-gray-500 dark:text-gray-400 italic px-4">
            Partner is typing...
          </div>
        )}
      </div>
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-rose-100 dark:border-gray-700"
      >
        <div className="flex items-center bg-white/50 dark:bg-gray-700/50 rounded-full px-4 py-2">
          {isRecording ? (
            <div className="flex items-center w-full justify-between">
              <button
                type="button"
                onClick={stopRecording}
                className="text-red-500 p-2"
              >
                <StopCircle size={24} />
              </button>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mx-4">
                <div
                  className="bg-rose-500 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min((recordingTime / 30000) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-center">
                {new Date(recordingTime).toISOString().substr(14, 5)}
              </span>
            </div>
          ) : (
            <>
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                className="flex-1 bg-transparent focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Type a message..."
              />
              <button
                type="button"
                onClick={startRecording}
                className="text-gray-500 dark:text-gray-400 p-2"
              >
                <Mic size={24} />
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-2 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Chat;
