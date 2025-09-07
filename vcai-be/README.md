# VcAi Backend

A Python backend API built with FastAPI and AutoGen for multi-agent AI conversations.

## Features

- **FastAPI REST API**: Modern, fast web framework for building APIs
- **AutoGen Integration**: Multi-agent conversational AI system
- **Agent Management**: Create, update, and manage AI agents
- **Conversation Handling**: Persistent conversation management
- **WebSocket Support**: Real-time communication capabilities
- **Comprehensive Logging**: Structured logging for debugging and monitoring
- **Docker Ready**: Containerization support for deployment

## Project Structure

```
vcai-be/
├── app/
│   ├── api/                    # API routes and endpoints
│   │   └── v1/
│   │       ├── endpoints/      # API endpoint definitions
│   │       └── api.py         # API router configuration
│   ├── core/                  # Core application configuration
│   │   ├── config.py         # Settings and configuration
│   │   └── exceptions.py     # Custom exception handlers
│   ├── models/               # Data models and schemas
│   │   └── schemas.py       # Pydantic schemas
│   ├── services/            # Business logic and services
│   │   └── autogen_service.py # AutoGen integration service
│   ├── utils/               # Utility functions and helpers
│   │   └── logging.py      # Logging configuration
│   └── main.py             # FastAPI application entry point
├── scripts/                # Development and deployment scripts
│   ├── start_dev.py       # Development server startup
│   └── test.py           # Test runner script
├── tests/                 # Test files
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables example
├── .gitignore           # Git ignore patterns
└── README.md           # This file
```

## Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- OpenAI API key (for AutoGen functionality)

### Installation

1. **Clone and navigate to the project:**

   ```bash
   cd vcai-be
   ```

2. **Create and activate a virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Set your OpenAI API key in `.env`:**
   ```env
   OPENAI_API_KEY=your-openai-api-key-here
   ```

### Running the Application

#### Development Mode

```bash
python scripts/start_dev.py
```

#### Production Mode

```bash
python -m app.main
```

The API will be available at:

- **API Documentation**: http://localhost:8000/api/v1/docs
- **ReDoc Documentation**: http://localhost:8000/api/v1/redoc
- **Health Check**: http://localhost:8000/health

## API Endpoints

### Health Endpoints

- `GET /` - Root health check
- `GET /health` - Basic health check
- `GET /api/v1/health/detailed` - Detailed health information

### Chat Endpoints

- `POST /api/v1/chat/message` - Send message to AutoGen agents
- `GET /api/v1/chat/conversations/{id}` - Get conversation by ID
- `GET /api/v1/chat/conversations` - List all conversations
- `DELETE /api/v1/chat/conversations/{id}` - Delete conversation

### Agent Management Endpoints

- `POST /api/v1/agents/create` - Create new agent
- `GET /api/v1/agents/` - List all agents
- `GET /api/v1/agents/{id}` - Get agent details
- `PUT /api/v1/agents/{id}` - Update agent configuration
- `DELETE /api/v1/agents/{id}` - Delete agent
- `POST /api/v1/agents/{id}/reset` - Reset agent conversation

## Configuration

### Environment Variables

Key environment variables (see `.env.example` for complete list):

```env
# OpenAI Configuration
OPENAI_API_KEY=your-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# API Configuration
API_V1_STR=/api/v1
SECRET_KEY=your-secret-key

# CORS Configuration
BACKEND_CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]

# Development Settings
ENVIRONMENT=development
DEBUG=True
LOG_LEVEL=INFO
```

## AutoGen Integration

The backend integrates AutoGen for multi-agent conversations with the following default agents:

- **User Proxy**: Handles user interactions and code execution
- **Assistant**: General-purpose AI assistant
- **Planner**: Task planning and breakdown specialist
- **Code Reviewer**: Code analysis and review expert

### Creating Custom Agents

Use the agent management endpoints to create custom agents:

```python
{
    "name": "DataAnalyst",
    "description": "Specialized in data analysis tasks",
    "system_message": "You are a data analyst expert...",
    "llm_config": {
        "model": "gpt-4-turbo-preview",
        "api_key": "your-api-key"
    }
}
```

## Development

### Running Tests

```bash
python scripts/test.py
```

### Code Quality

```bash
# Format code with black
black app/ tests/

# Lint with flake8
flake8 app/ tests/

# Type checking with mypy
mypy app/
```

### Adding New Endpoints

1. Create endpoint file in `app/api/v1/endpoints/`
2. Define routes using FastAPI decorators
3. Add router to `app/api/v1/api.py`
4. Add corresponding schemas in `app/models/schemas.py`

## Deployment

### Docker Deployment

```bash
# Build image
docker build -t vcai-backend .

# Run container
docker run -p 8000:8000 --env-file .env vcai-backend
```

### Production Considerations

- Set `DEBUG=False` in production
- Use proper database (PostgreSQL) instead of SQLite
- Set up Redis for caching and session management
- Configure proper logging and monitoring
- Use HTTPS with proper SSL certificates
- Set up load balancing for high availability

## Integration with Frontend

The backend is designed to work with the VcAi frontend project located in `../vcai-fe/`. Key integration points:

- CORS is configured to allow frontend origins
- API endpoints match frontend service expectations
- WebSocket support for real-time chat features
- Consistent error handling and response formats

## Troubleshooting

### Common Issues

1. **ImportError for autogen**: Ensure `pyautogen` is installed correctly
2. **OpenAI API errors**: Verify your API key is set correctly
3. **CORS errors**: Check `BACKEND_CORS_ORIGINS` includes your frontend URL
4. **Port conflicts**: Change the port in startup scripts if 8000 is in use

### Logging

Logs are written to:

- Console output (stdout)
- `logs/vcai-backend.log` file

Adjust log level via `LOG_LEVEL` environment variable.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues:

1. Check the API documentation at `/api/v1/docs`
2. Review the logs for error details
3. Ensure all environment variables are set correctly
4. Verify your OpenAI API key has sufficient credits
