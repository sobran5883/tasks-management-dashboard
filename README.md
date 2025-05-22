#Task Manager

A modern, full-stack task management application built with React, Node.js, and MongoDB. TaskZen helps you organize your tasks efficiently with a beautiful and intuitive user interface.

## Features

- 🔐 User Authentication and Authorization
- 📝 Create, Read, Update, and Delete Tasks
- 📊 Task Analytics and Progress Tracking
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive Design
- 🔄 Real-time Updates
- 📈 Task Statistics and Visualizations

## Tech Stack

### Frontend
- React
- Redux Toolkit for State Management
- React Router for Navigation
- Tailwind CSS for Styling
- Headless UI Components
- React Hook Form for Form Handling
- Recharts for Data Visualization
- Firebase Integration
- Vite as Build Tool

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for Password Hashing
- CORS Support
- Cookie Parser
- Morgan for Logging

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sobran5883/tasks-management-dashboard.git
cd tasks-management-dashboard
```

2. Install Frontend Dependencies:
```bash
cd client
npm install
```

3. Install Backend Dependencies:
```bash
cd ../server
npm install
```

4. Create a `.env` file in the server directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Running the Application

1. Start the Backend Server:
```bash
cd server
npm start
```

2. Start the Frontend Development Server:
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend).

## Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start the server with nodemon

## Project Structure

```
taskzen-task-manager/
├── client/                 # Frontend React application
│   ├── src/               # Source files
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
└── server/                # Backend Node.js application
    ├── controllers/       # Route controllers
    ├── models/           # Database models
    ├── routes/           # API routes
    ├── middlewares/      # Custom middlewares
    ├── utils/            # Utility functions
    └── package.json      # Backend dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- React Team for the amazing framework
- Vite Team for the blazing fast build tool
- Tailwind CSS for the utility-first CSS framework
- MongoDB Team for the powerful database
