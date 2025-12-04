# FrostChat 🧊

A modern real-time chat application with a sleek glassmorphism interface and ice blue accent highlights.

## Features

- 🔐 **User Authentication** - Secure login/register with JWT tokens
- 💬 **Real-time Messaging** - One-to-one and group chat powered by Socket.IO
- 📁 **Media Sharing** - Share images and files via Cloudinary
- ⌨️ **Typing Indicators** - See when others are typing
- 🟢 **Online Presence** - Know who's online
- 👤 **Profile Management** - Customize your profile and avatar

## Tech Stack

- **Frontend**: React, Tailwind CSS, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **Database**: MongoDB with Mongoose
- **Storage**: Cloudinary for media files
- **Authentication**: JWT + bcrypt

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- Cloudinary account

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd frostchat
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Configure environment variables
```bash
# Copy example env files
cp server/.env.example server/.env
cp client/.env.example client/.env
```

4. Start the development servers
```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm run dev
```

## Project Structure

```
frostchat/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   └── ...
├── server/          # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── socket/
│   └── utils/
└── README.md
```

## License

MIT License - feel free to use this project for your portfolio!
