# VcAi Frontend-Backend Integration Guide

## 🔗 Integration Overview

This guide explains how the VcAi frontend integrates with the Python backend for real-time startup analysis using WebSockets and REST APIs.

## 🚀 Quick Setup

### 1. Backend Setup

```bash
cd vcai-be
./setup.sh
source venv/bin/activate
# Edit .env file with your OpenAI API key
python scripts/start_dev.py
```

### 2. Frontend Setup

```bash
cd vcai-fe
npm install
# Copy environment configuration
cp .env.example .env
# Edit .env if needed (default backend URL: http://localhost:8000)
npm run dev
```

## 🔄 Integration Flow

### 1. **User Input & File Upload**

- User enters business idea and uploads files
- Frontend calls `useChatInterface.handleSubmit()`
- Converts files to FormData and sends to backend

```typescript
// Frontend: src/hooks/useChatInterface.ts
await startAnalysis({
  prompt: input,
  files: files.length > 0 ? files : undefined,
});
```

### 2. **Backend Analysis Initiation**

- Backend receives POST `/api/v1/chat/analyze-startup`
- Returns conversation ID and WebSocket URL
- Starts 5-agent workflow in background

```typescript
// Backend API Response
{
  conversation_id: "uuid",
  status: "started",
  message: "Analysis initiated",
  websocket_url: "/api/v1/ws?conversation_id=uuid"
}
```

### 3. **Real-time WebSocket Communication**

- Frontend connects to WebSocket for live updates
- Receives typing indicators, agent messages, status updates
- Updates UI in real-time as analysis progresses

```typescript
// WebSocket Message Types
{
  type: "agent_message",
  agent_type: "marketing",
  message: "Analysis content...",
  conversation_id: "uuid"
}
```

### 4. **Multi-Phase Analysis**

#### Phase 1: Parallel Specialist Analysis (2-5 minutes)

- Marketing, Product, Legal agents analyze simultaneously
- Frontend shows typing indicators and messages in real-time
- Each agent provides domain-specific insights

#### Phase 2: Verification Conversations (3-6 minutes)

- Verifier agent reviews each specialist analysis
- Separate conversations: Marketing↔Verifier, Product↔Verifier, Legal↔Verifier
- Frontend displays verification process

#### Phase 3: Summary Generation (1-2 minutes)

- Summary agent synthesizes all verified results
- Generates comprehensive startup success report
- Frontend receives structured report data

### 5. **Navigation to Summary**

- When analysis completes, frontend automatically navigates to summary page
- Passes both conversation results and backend report
- Summary page renders professional report with scores and recommendations

## 🏗️ Architecture Components

### Frontend Components Updated

#### `useChatInterface.ts`

- **Added**: Backend integration via `useStartupAnalysis`
- **Added**: File conversion for API upload
- **Added**: Navigation with backend flags

#### `useStartupAnalysis.ts` (New)

- **Manages**: Complete analysis workflow state
- **Handles**: WebSocket connection and message processing
- **Provides**: Real-time updates to UI components

#### `useRealTimeConversations.ts` (New)

- **Replaces**: Simulated conversation data
- **Maps**: Backend agent responses to frontend format
- **Maintains**: Backward compatibility with existing UI

#### `SimpleAgentConversation.tsx`

- **Added**: Backend mode vs simulation mode
- **Added**: Connection status indicators
- **Added**: Real-time progress tracking

#### `SummaryReportPage.tsx`

- **Added**: Backend report processing
- **Added**: Format conversion from backend to frontend structure
- **Maintains**: Existing report visualization

### Backend Integration Points

#### REST API Endpoints

- `POST /api/v1/chat/analyze-startup` - Start analysis
- `GET /api/v1/chat/conversations/{id}` - Get conversation data
- `GET /api/v1/agents/` - List available agents
- `GET /api/v1/agents/workflow/status` - Get workflow info

#### WebSocket Communication

- `ws://localhost:8000/api/v1/ws?conversation_id={id}`
- Real-time message types:
  - `conversation_status` - Phase transitions
  - `typing_indicator` - Agent typing states
  - `agent_message` - Agent responses
  - `final_report` - Completed analysis

## 📱 User Experience Flow

### 1. **Home Page**

- User enters business idea and uploads files
- Click submit triggers backend analysis
- Immediate navigation to conversation view

### 2. **Agent Conversation Page**

- Real-time connection status indicator
- Live agent typing indicators
- Messages stream in real-time
- Progress indicator shows current phase

### 3. **Summary Report Page**

- Automatic navigation when analysis completes
- Professional report with AI-generated insights
- Scores, recommendations, and next steps

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)

```env
VITE_BACKEND_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_ENV=development
```

#### Backend (.env)

```env
OPENAI_API_KEY=your-api-key-here
BACKEND_CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
```

## 🧪 Testing Integration

### Manual Testing

1. Start both backend and frontend
2. Submit a test business idea
3. Watch real-time conversation flow
4. Verify summary report generation

### Automated Testing

```typescript
// In browser console
testBackendIntegration();
```

### Backend Testing

```bash
cd vcai-be
python test_workflow.py
```

## 🔍 Debugging

### Common Issues

#### 1. **WebSocket Connection Failed**

- Check backend is running on port 8000
- Verify CORS configuration includes frontend URL
- Check browser console for connection errors

#### 2. **Analysis Not Starting**

- Verify OpenAI API key is set in backend
- Check backend logs for errors
- Ensure file uploads are properly formatted

#### 3. **Messages Not Appearing**

- Check WebSocket connection status indicator
- Verify conversation ID is properly passed
- Check browser network tab for WebSocket messages

### Debug Tools

#### Frontend Debug Information

```typescript
// Check analysis state
console.log(analysisState);

// Check WebSocket connection
console.log(connectionStatus);
```

#### Backend Logs

```bash
# View backend logs
tail -f logs/vcai-backend.log
```

## 🚀 Production Deployment

### Frontend Build

```bash
cd vcai-fe
npm run build
# Deploy dist/ directory to your hosting service
```

### Backend Deployment

```bash
cd vcai-be
# Set production environment variables
# Deploy using Docker or your preferred method
```

### Environment Configuration

- Update `VITE_BACKEND_URL` to production backend URL
- Configure proper CORS origins
- Set production OpenAI API key
- Use secure WebSocket (wss://) for HTTPS sites

## 📈 Performance Considerations

### Frontend Optimizations

- WebSocket connection pooling
- Message batching for UI updates
- Lazy loading of conversation history

### Backend Optimizations

- Agent response caching
- Connection management
- Rate limiting for API endpoints

## 🔒 Security Considerations

### API Security

- Rate limiting on analysis endpoints
- File upload validation and sanitization
- OpenAI API key protection

### WebSocket Security

- Connection authentication
- Message validation
- CORS policy enforcement

---

This integration provides a seamless, real-time experience where users can see AI agents working on their startup analysis in real-time, culminating in a comprehensive business report.
