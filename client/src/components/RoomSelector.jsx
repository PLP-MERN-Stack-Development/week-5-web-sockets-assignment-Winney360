import React, { useEffect, useState } from 'react';
import { useSocket } from '../socket/socket';

const RoomSelector = () => {
  const { joinRoom, currentRoom, unreadCounts } = useSocket();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error('Error fetching rooms:', err));
  }, []);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Chat Rooms</h3>
      {rooms.map((room) => (
        <button
          key={room}
          onClick={() => joinRoom(room)}
          className={`w-full text-left p-2 rounded-md ${
            currentRoom === room ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {room} {unreadCounts[room] > 0 && `(${unreadCounts[room]})`}
        </button>
      ))}
    </div>
  );
};

export default RoomSelector;