import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, getDocs, updateDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';

const Chat = ({ partnerId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [partnerIsTyping, setPartnerIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  const chatId = [user.uid, partnerId].sort().join('_');

  useEffect(() => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    const chatRef = collection(db, 'chats');
    const q = query(chatRef, where('users', '==', chatId));

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
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      text: newMessage,
      senderId: user.uid,
      timestamp: serverTimestamp(),
      seen: false,
    });

    setNewMessage('');
    handleTyping(false);
  };

  const handleTyping = async (isTyping) => {
    const chatRef = collection(db, 'chats');
    const chatDocRef = (await getDocs(query(chatRef, where('users', '==', chatId)))).docs[0]?.ref;

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
      <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-2 ${msg.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-lg p-2 ${
                msg.senderId === user.uid ? 'bg-blue-500 text-white' : 'bg-gray-300'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {partnerIsTyping && <div className="text-gray-500">Partner is typing...</div>}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            className="flex-1 border rounded-l-lg p-2"
            placeholder="Type a message..."
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
