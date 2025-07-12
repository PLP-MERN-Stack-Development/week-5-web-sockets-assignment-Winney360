
# Real-Time Chat Application

This real-time chat application, built with Node.js, Express, Socket.io, and React, enables users to join multiple chat rooms, send public and private messages, share images, search messages, and receive real-time notifications. Designed for performance and user experience, it includes error handling, message pagination, and a responsive design for desktop and mobile. This project fulfills the assignment requirements for a modern, interactive chat system.

## Features

- Multiple Chat Rooms: Join `general`, `support`, or `random` rooms with room-specific messaging.
- Private Messaging: Send private messages to specific users, displayed in blue (`bg-blue-100`).
- File/Image Sharing: Upload and display images (JPEG, PNG, GIF, up to 5MB) with read receipts.
- Message Search: Search messages within the current room.
- Read Receipts: Show `Read by: X user(s)` for each message.
- Typing Indicators: Display when users are typing in the current room.
- Online/Offline Status: Show real-time user status with join/leave notifications.
- Unread Message Count: Track unread messages for inactive rooms.
- Browser Notifications: Alert users of new messages (requires permission).
- Sound Notifications: Play `notification.mp3` for new messages.
- Message Pagination: Load older messages in batches of 20 via a "Load More" button.
- Reconnection Logic: Automatically reconnect with up to 5 attempts on disconnect.
- Responsive Design: Mobile-first with Tailwind CSS; sidebar on desktop, stacked on mobile.
- Error Handling: Validate file types/sizes and handle network errors.
- Performance: Limit each room to 100 messages and use Socket.io rooms for efficiency.

## Prerequisites

- Node.js: v18.x or higher
- pnpm: v8.x or higher
- Git: For cloning the repository
- Browser: Chrome, Firefox, or similar with JavaScript enabled

## Setup Instructions

1. Clone the Repository:
```bash
git clone <your-repo-url>
cd socketio-chat
```

2. Install Server Dependencies:
```bash
cd server
pnpm install
```
Required: express, socket.io, cors, dotenv, multer, nodemon (dev)

3. Install Client Dependencies:
```bash
cd ../client
pnpm install
```
Required: react, react-dom, socket.io-client, tailwindcss, postcss, autoprefixer, @vitejs/plugin-react, vite

4. Configure Environment Variables:

server/.env:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
```

client/.env:
```env
VITE_SOCKET_URL=http://localhost:5000
```

5. Set Up Uploads Folder:
```bash
mkdir -p server/public/uploads
touch server/public/uploads/.gitkeep
```
Note: Uploaded files are ignored by Git (server/.gitignore), but .gitkeep preserves the folder.


## Run the Application

In server directory:
```bash
cd server
pnpm run dev
```

In client directory (new terminal):
```bash
cd client
pnpm run dev
```

Server: http://localhost:5000  
Client: http://localhost:5173

Open the app in multiple tabs and test login, room selection, public/private messaging, file uploads, search, and notifications.



## Screenshots

- Login Screen: screenshots/screenshot1.png  
- Chat Interface : screenshots/screenshot2.png  
- File Upload: screenshots/screenshot3.png  
- Message Search: screenshots/screenshot4.png  


To capture additional screenshots:  
Use Windows Snipping Tool (Win+Shift+S) or ShareX.  
For dynamic features, record GIFs with ScreenToGif.  
Save in screenshots/ as screenshotX.png.

## Project Structure

```
socketio-chat/
├── client/
│   ├── public/
│   │   └── notification.mp3
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.jsx
│   │   │   ├── FileUploader.jsx
│   │   │   ├── MessageSearch.jsx
│   │   │   └── RoomSelector.jsx
│   │   ├── socket/
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json   
│   └── vite.config.js
├── server/
│   ├── public/
│   │   └── uploads/
│   │       └── .gitkeep
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── screenshots/
│   ├── screenshot1.png
│   ├── screenshot2.png
│   ├── screenshot3.png
│   └── screenshot5.png
└── README.md
```

For local demos, note that the client runs on http://localhost:5173
