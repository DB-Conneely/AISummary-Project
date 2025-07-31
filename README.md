# IntuitiveAI: AI-Powered Meeting Summarizer

![INTUAITIVE LOGO](src/frontend/public/logo.svg)

IntuitiveAI is a sophisticated full-stack application designed to revolutionize how teams capture and distill insights from meetings, videos, and audio recordings. By harnessing state-of-the-art AI for transcription and summarization, it converts raw inputs—such as YouTube URLs or uploaded MP4/M4A files—into crisp, actionable bullet points focusing on key decisions and tasks. This tool empowers professionals to reclaim valuable time, fostering productivity in fast-paced environments like tech startups, corporate teams, and content creation workflows.

Built with a modern tech stack, IntuitiveAI demonstrates expertise in AI integration, real-time systems, and scalable web development—making it an impressive showcase for full-stack engineering and machine learning applications.

## Key Features

- **Intelligent Summarization Pipeline**: Automatically extracts audio, transcribes content via AssemblyAI, and generates focused summaries using local LLMs (e.g., Llama 3.2 via Ollama), emphasizing actions and decisions.
- **Flexible Input Handling**: Supports YouTube video downloads and direct file uploads, with seamless conversion to audio formats using FFmpeg.
- **Real-Time User Feedback**: Leverages Socket.IO for live progress updates during multi-stage processing, ensuring a smooth and transparent experience.
- **Secure and User-Friendly Authentication**: Integrates Firebase for Google-based sign-in, with intuitive error handling and result persistence.
- **Cloud-Enabled Storage**: Stores processed audio on AWS S3 and summaries in a lightweight SQLite database for easy access and retrieval.
- **Elegant Frontend Design**: A responsive React interface with animated transitions, loading animations, and dynamic backgrounds for an engaging user experience.
- **Robust Error Management**: Comprehensive cleanup of temporary files, fallback mechanisms, and user-centric messaging to handle edge cases gracefully.

## Technology Stack

### Frontend

- React.js with React Router for seamless navigation
- Firebase for authentication
- Socket.IO for real-time communication
- Tailwind CSS for modern, animated styling

### Backend

- Node.js and Express.js for the API server
- AWS SDK for S3 integration
- AssemblyAI for high-accuracy transcription
- Ollama for efficient local AI summarization
- FFmpeg for media processing
- SQLite for data persistence
- Multer and Axios for file handling and API calls

## Setup and Usage

### Prerequisites

- Node.js (v18 or higher)
- FFmpeg (install via package manager, e.g., brew install ffmpeg on macOS)
- Ollama (install and pull the Llama 3.2 model: ollama pull llama3.2)
- API keys for AWS, AssemblyAI, and Firebase (configured in .env files)

### Installation

1. Clone the repository and navigate to the project root.
2. Install dependencies: npm install
3. Navigate to the frontend directory: cd src/frontend and install: npm install
4. Configure environment variables in src/backend/.env and src/frontend/src/.env.

### Running the Application

- Launch both services: npm start (from the root)
- Access the app at http://localhost:3000
- Sign in with Google, upload content, and receive AI-generated summaries.

## License
MIT

## Contact
Reach me on Telegram or X at [@sk3neels](https://t.me/sk3neels). I’m open to opportunities—let’s discuss!