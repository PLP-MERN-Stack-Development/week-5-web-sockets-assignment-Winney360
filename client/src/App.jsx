import React, { useState, useEffect } from 'react';
import { useSocket } from './socket/socket';
import RoomSelector from './components/RoomSelector';
import Chat from './components/Chat';
import FileUploader from './components/FileUploader';
import MessageSearch from './components/MessageSearch';

const App = () => {
  const { connect, isConnected, currentRoom, users } = useSocket();
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('general');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      connect(username, room);
      setIsAuthenticated(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {!isAuthenticated ? (
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Join Chat</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Room</label>
                <select
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="general">General</option>
                  <option value="support">Support</option>
                  <option value="random">Random</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row h-screen">
          <div className="w-full md:w-1/4 bg-white p-4 border-r">
            <RoomSelector />
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Online Users</h3>
              <ul>
                {users.map((user) => (
                  <li key={user.id} className="text-sm">
                    {user.username} ({user.room})
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="bg-white p-4 border-b">
              <h2 className="text-xl font-bold">Chat: {currentRoom}</h2>
              <p className="text-sm text-gray-500">
                {isConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
            <MessageSearch />
            <Chat />
            <FileUploader />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;