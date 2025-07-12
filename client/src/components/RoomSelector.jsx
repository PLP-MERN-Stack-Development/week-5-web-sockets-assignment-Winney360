import React, { useState, useEffect } from 'react';
   import { useSocket } from '../socket/socket';

   const RoomSelector = () => {
     const { currentRoom, joinRoom, isConnected } = useSocket();
     const [rooms, setRooms] = useState([]);
     const [selectedRoom, setSelectedRoom] = useState(currentRoom);

     useEffect(() => {
       const fetchRooms = async () => {
         try {
           console.log('Fetching rooms from http://localhost:5000/api/rooms');
           const res = await fetch('http://localhost:5000/api/rooms');
           console.log('Rooms response:', res.status, res.statusText);
           const text = await res.text();
           console.log('Response text:', text);
           const data = JSON.parse(text);
           setRooms(data);
         } catch (err) {
           console.error('Error fetching rooms:', err);
         }
       };
       fetchRooms();
     }, []);

     const handleRoomChange = (e) => {
       const newRoom = e.target.value;
       setSelectedRoom(newRoom);
       if (isConnected && newRoom) {
         joinRoom(newRoom);
       }
     };

     return (
       <div className="p-4 border-b">
         <h3 className="text-lg font-semibold mb-2">Select Room</h3>
         <select
           value={selectedRoom}
           onChange={handleRoomChange}
           className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           disabled={!isConnected}
         >
           <option value="">Select a room</option>
           {rooms.map((room) => (
             <option key={room} value={room}>
               {room}
             </option>
           ))}
         </select>
       </div>
     );
   };

   export default RoomSelector;