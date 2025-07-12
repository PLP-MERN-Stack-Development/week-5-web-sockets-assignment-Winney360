# Real-Time Chat Application

## Overview
This is a real-time chat application built with Node.js, Express, Socket.io, and React. It supports multiple chat rooms, private messaging, file/image sharing, read receipts, typing indicators, unread message counts, browser notifications, sound notifications, message pagination, and message search. The application is designed to provide a smooth user experience with proper error handling and a responsive design that works seamlessly on both desktop and mobile devices.

## Features Implemented
- **Multiple Chat Rooms**: Users can join predefined rooms (general, support, random) with room-specific messaging.
- **Private Messaging**: Users can send private messages to specific users.
- **File/Image Sharing**: Supports uploading and sharing images (JPEG, PNG, GIF) up to 5MB.
- **Read Receipts**: Displays the number of users who have read each message.
- **Typing Indicators**: Shows when users are typing in the current room.
- **Online/Offline Status**: Displays real-time user status with join/leave notifications.
- **Unread Message Count**: Shows unread message counts for rooms not currently viewed.
- **Browser Notifications**: Uses the Web Notifications API to alert users of new messages.
- **Sound Notifications**: Plays a sound for new messages (requires `notification.mp3` in `client/public/`).
- **Message Pagination**: Loads older messages in batches of 20 with a "Load More" button.
- **Message Search**: Allows users to search messages within the current room.
- **Reconnection Logic**: Automatically reconnects with up to 5 attempts if the connection is lost.
- **Responsive Design**: Mobile-first design using Tailwind CSS, with a sidebar layout on desktop and stacked layout on mobile.
- **Error Handling**: Includes validation for file uploads and network errors.
- **Performance Optimization**: Limits stored messages to 100 per room to prevent memory issues and uses Socket.io rooms for efficient messaging.

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone <your-repo-url>









[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19929257&assignment_repo_type=AssignmentRepo)
# Real-Time Chat Application with Socket.io

This assignment focuses on building a real-time chat application using Socket.io, implementing bidirectional communication between clients and server.

## Assignment Overview

You will build a chat application with the following features:
1. Real-time messaging using Socket.io
2. User authentication and presence
3. Multiple chat rooms or private messaging
4. Real-time notifications
5. Advanced features like typing indicators and read receipts

## Project Structure

```
socketio-chat/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # UI components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── socket/         # Socket.io client setup
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Node.js back-end
│   ├── config/             # Configuration files
│   ├── controllers/        # Socket event handlers
│   ├── models/             # Data models
│   ├── socket/             # Socket.io server setup
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies
└── README.md               # Project documentation
```

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Follow the setup instructions in the `Week5-Assignment.md` file
4. Complete the tasks outlined in the assignment

## Files Included

- `Week5-Assignment.md`: Detailed assignment instructions
- Starter code for both client and server:
  - Basic project structure
  - Socket.io configuration templates
  - Sample components for the chat interface

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser
- Basic understanding of React and Express

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete both the client and server portions of the application
2. Implement the core chat functionality
3. Add at least 3 advanced features
4. Document your setup process and features in the README.md
5. Include screenshots or GIFs of your working application
6. Optional: Deploy your application and add the URLs to your README.md

## Resources

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Building a Chat Application with Socket.io](https://socket.io/get-started/chat) 