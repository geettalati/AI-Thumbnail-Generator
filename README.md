# Thumblify - AI Thumbnail Generator

Thumblify is a modern, production-ready full-stack application that leverages Artificial Intelligence to automatically generate high-quality thumbnails. It combines a seamless user experience built with React and TailwindCSS alongside a robust Node.js backend integrating advanced AI models for prompt and image generation.


##  Tech Stack

### Frontend (Client)
- **Framework**: React 19 with Vite
- **Styling**: TailwindCSS v4
- **Routing**: React Router DOM
- **Animations**: Framer Motion & Lenis (Smooth Scrolling)
- **Icons**: Lucide React
- **Network Requests**: Axios

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: bcryptjs & express-session
- **AI Integrations**: Google GenAI (`@google/genai`, `@google/generative-ai`)
- **Cloud Storage**: Cloudinary

## Getting Started

Follow these steps to get the project running locally.

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Local or Atlas)
- Cloudinary Account (for image storage)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Thumblify.git
   cd Thumblify
   ```

2. **Setup the Backend (Server)**
   ```bash
   cd Server
   npm install
   ```
   Create a `.env` file in the `Server` directory with the necessary environment variables (Database URI, API Keys, Cloudinary config).
   ```bash
   # Run the server in development mode
   npm run server
   ```

3. **Setup the Frontend (Client)**
   ```bash
   cd ../Client
   npm install
   ```
   Create a `.env` file in the `Client` directory if required by your frontend configuration.
   ```bash
   # Run the client
   npm run dev
   ```

### Docker (Optional)
If a `docker-compose.yml` is present, you can easily spin up the entire stack using Docker:
```bash
docker-compose up --build
```

## 📁 Project Structure

```text
Thumblify/
├── Client/         # React Frontend application
│   ├── src/        # UI components, pages, and hooks
│   └── public/     # Static assets
└── Server/         # Node.js/Express Backend application
    ├── configs/    # Configuration files (Database, AI, Cloudinary)
    ├── controllers/# Route controllers and business logic
    ├── middlewares/# Express middlewares (Auth, validation)
    ├── models/     # Mongoose database schemas
    └── routes/     # API endpoint definitions
```


