import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../socket/socket';

const Chat = () => {
  const { 
    messages, 
    readReceipts, 
    markMessageRead, 
    currentRoom, 
    isConnected, 
    sendMessage, 
    sendPrivateMessage, 
    setTyping, 
    typingUsers, 
    users 
  } = useSocket();
  const [message, setMessage] = useState('');
  const [privateMessage, setPrivateMessage] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const loadMoreMessages = async () => {
    try {
      console.log(`Loading more messages for room: ${currentRoom}, page: ${page + 1}`);
      const res = await fetch(`/api/messages/${currentRoom}?page=${page + 1}&limit=20`);
      const data = await res.json();
      setMessages((prev) => [...data.messages, ...prev]);
      setPage(data.page);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && isConnected) {
      console.log('Sending public message:', message);
      sendMessage(message);
      setMessage('');
      setTyping(false);
    }
  };

  const handleSendPrivateMessage = (e) => {
    e.preventDefault();
    if (privateMessage.trim() && recipientId && isConnected) {
      console.log('Sending private message to:', recipientId, privateMessage);
      sendPrivateMessage(recipientId, privateMessage);
      setPrivateMessage('');
    }
  };

  const handleTyping = () => {
    if (isConnected) {
      setTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
      }, 2000);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    messages.forEach((msg) => {
      console.log('Processing message:', msg);
      if (!readReceipts[msg.id]?.includes(socket.id)) {
        markMessageRead(msg.id);
      }
    });
  }, [messages, readReceipts]);

  return (
    <div className="flex-1 flex flex-col p-4 overflow-auto bg-gray-50">
      {hasMore && (
        <button
          onClick={loadMoreMessages}
          disabled={!isConnected}
          className="mb-4 p-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-600 transition"
        >
          Load More
        </button>
      )}
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-3 rounded-md ${
              msg.system
                ? 'text-gray-500 italic bg-gray-200'
                : msg.isPrivate
                ? 'bg-blue-100'
                : 'bg-white shadow-sm'
            }`}
          >
            {msg.isFile ? (
              <>
                <strong className="font-semibold">{msg.sender}</strong>:
                <img
                  src={`http://localhost:5000${msg.file}`}
                  alt="Shared file"
                  className="max-w-xs my-2 rounded-md"
                  onError={(e) => console.error('Image load error:', msg.file)}
                />
                <div className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                  {readReceipts[msg.id]?.length > 0 && (
                    <span className="ml-2">
                      Read by: {readReceipts[msg.id].length} user(s)
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <strong className="font-semibold">{msg.sender}</strong>: {msg.message}
                <div className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                  {readReceipts[msg.id]?.length > 0 && (
                    <span className="ml-2">
                      Read by: {readReceipts[msg.id].length} user(s)
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {typingUsers.length > 0 && (
        <div className="text-sm text-gray-500 italic mb-2">
          {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
        </div>
      )}
      <form
        onSubmit={handleSendPrivateMessage}
        className="mt-2 flex gap-2"
      >
        <select
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          className="p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!isConnected}
        >
          <option value="">Select recipient</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={privateMessage}
          onChange={(e) => setPrivateMessage(e.target.value)}
          placeholder="Private message..."
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!isConnected || !recipientId}
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-600 transition"
          disabled={!isConnected || !recipientId}
        >
          Send Private
        </button>
      </form>
      <form
        onSubmit={handleSendMessage}
        className="mt-2 flex gap-2"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!isConnected}
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-600 transition"
          disabled={!isConnected}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;