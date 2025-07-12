import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../socket/socket';

const Chat = () => {
  const { messages, readReceipts, markMessageRead, currentRoom, isConnected, sendMessage, setTyping, typingUsers } = useSocket();
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const loadMoreMessages = async () => {
    try {
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
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
      setTyping(false);
    }
  };

  const handleTyping = () => {
    setTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 2000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    messages.forEach((msg) => {
      if (!readReceipts[msg.id]?.includes(socket.id)) {
        markMessageRead(msg.id);
      }
    });
  }, [messages, readReceipts]);

  return (
    <div className="flex-1 flex flex-col p-4 overflow-auto">
      {hasMore && (
        <button
          onClick={loadMoreMessages}
          disabled={!isConnected}
          className="mb-4 p-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
        >
          Load More
        </button>
      )}
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded-md ${
              msg.system
                ? 'text-gray-500 italic'
                : msg.isPrivate
                ? 'bg-blue-100'
                : 'bg-gray-100'
            }`}
          >
            {msg.isFile ? (
              <>
                <strong>{msg.sender}</strong>: <img src={msg.file} alt="Shared file" className="max-w-xs my-2" />
                <span className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
                {readReceipts[msg.id]?.length > 0 && (
                  <span className="text-xs text-gray-500 ml-2">
                    Read by: {readReceipts[msg.id].length} user(s)
                  </span>
                )}
              </>
            ) : (
              <>
                <strong>{msg.sender}</strong>: {msg.message}
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
                {readReceipts[msg.id]?.length > 0 && (
                  <span className="text-xs text-gray-500 ml-2">
                    Read by: {readReceipts[msg.id].length} user(s)
                  </span>
                )}
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {typingUsers.length > 0 && (
        <div className="text-sm text-gray-500 italic">
          {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
        </div>
      )}
      <form onSubmit={handleSendMessage} className="mt-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-l-md"
          disabled={!isConnected}
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r-md disabled:bg-gray-400"
          disabled={!isConnected}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;