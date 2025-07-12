import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [readReceipts, setReadReceipts] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});

  const connect = (username, room = 'general') => {
    socket.connect();
    if (username) {
      socket.emit('user_join', { username, room });
      setCurrentRoom(room);
    }
  };

  const disconnect = () => {
    socket.disconnect();
  };

  const sendMessage = (message) => {
    socket.emit('send_message', { message });
  };

  const sendPrivateMessage = (to, message) => {
    socket.emit('private_message', { to, message });
  };

  const setTyping = (isTyping) => {
    socket.emit('typing', isTyping);
  };

  const joinRoom = (room) => {
    socket.emit('join_room', room);
    setCurrentRoom(room);
    setMessages([]);
    setUnreadCounts((prev) => ({ ...prev, [room]: 0 }));
  };

  const markMessageRead = (messageId) => {
    socket.emit('message_read', { messageId, room: currentRoom });
  };

  useEffect(() => {
    Notification.requestPermission();

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onReceiveMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => [...prev, message]);
      if (message.room !== currentRoom) {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.room]: (prev[message.room] || 0) + 1,
        }));
        if (Notification.permission === 'granted') {
          new Notification(`New message in ${message.room}`, {
            body: `${message.sender}: ${message.message || 'Sent an image'}`,
          });
        }
        const audio = new Audio('/notification.mp3');
        audio.play().catch((err) => console.error('Audio playback error:', err));
      }
    };

    const onPrivateMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => [...prev, message]);
      if (Notification.permission === 'granted') {
        new Notification(`Private message from ${message.sender}`, {
          body: message.message || 'Sent an image',
        });
      }
      const audio = new Audio('/notification.mp3');
      audio.play().catch((err) => console.error('Audio playback error:', err));
    };

    const onUserList = (userList) => {
      setUsers(userList);
    };

    const onUserJoined = (user) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} joined the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const onUserLeft = (user) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} left the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const onTypingUsers = (users) => {
      setTypingUsers(users);
    };

    const onRoomMessages = (roomMessages) => {
      setMessages(roomMessages);
      setUnreadCounts((prev) => ({ ...prev, [currentRoom]: 0 }));
    };

    const onReadReceipt = ({ messageId, userId }) => {
      setReadReceipts((prev) => ({
        ...prev,
        [messageId]: [...(prev[messageId] || []), userId],
      }));
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceiveMessage);
    socket.on('private_message', onPrivateMessage);
    socket.on('user_list', onUserList);
    socket.on('user_joined', onUserJoined);
    socket.on('user_left', onUserLeft);
    socket.on('typing_users', onTypingUsers);
    socket.on('room_messages', onRoomMessages);
    socket.on('read_receipt', onReadReceipt);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onReceiveMessage);
      socket.off('private_message', onPrivateMessage);
      socket.off('user_list', onUserList);
      socket.off('user_joined', onUserJoined);
      socket.off('user_left', onUserLeft);
      socket.off('typing_users', onTypingUsers);
      socket.off('room_messages', onRoomMessages);
      socket.off('read_receipt', onReadReceipt);
    };
  }, [currentRoom]);

  return {
    socket,
    isConnected,
    lastMessage,
    messages,
    users,
    typingUsers,
    currentRoom,
    readReceipts,
    unreadCounts,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    joinRoom,
    markMessageRead,
  };
};

export default socket;