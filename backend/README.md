# Resume Analyzer Backend API

Backend API for the AI-Powered Resume Analyzer platform.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Sequelize ORM)
- **Cache**: Redis
- **AI**: Google Gemini API
- **Authentication**: JWT + bcrypt

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Redis (v7 or higher)
- Google Gemini API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up database:
```bash
# Create PostgreSQL database
createdb resume_analyzer

# Run migrations (coming soon)
npm run migrate
```

4. Start development server:
```bash
npm run dev
```

## API Documentation

API documentation will be available at `http://localhost:5000/api-docs` when the server is running.

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── models/         # Database models
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   ├── app.ts          # Express app setup
│   └── server.ts       # Server entry point
├── uploads/            # File uploads
└── tests/              # Test files
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code

## License

MIT
