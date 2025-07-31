# React + Vite

This is a React chat application with intelligent caching that uses a REST API to provide responses to user questions.

## Features

- 💬 Real-time chat interface
- 🌐 REST API integration (JSONPlaceholder demo)
- ⚡ In-memory caching for instant responses
- 🎨 Modern, responsive design
- 🔄 Loading states and error handling

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

## Usage

- Type any question in the input field
- Press Enter or click Send
- The first time you ask a question, it will call the REST API
- Subsequent identical questions will use the cached response (marked with "Cached" badge)
- Use "Clear Cache" to reset cached responses
- Use "Clear Chat" to clear the conversation history

## API Configuration

The app currently uses JSONPlaceholder API as a demo. To use your own API:

1. Replace the API endpoint in `src/services/chatService.js`
2. Update the request format to match your API
3. Modify the response processing logic as needed

```javascript
// Example API call structure
const response = await fetch('YOUR_API_ENDPOINT', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // Add your API headers here
  },
  body: JSON.stringify({
    // Your API request format
  })
});
```

## Error Handling

The app handles various error scenarios:
- API endpoint not found (404)
- Server errors (500)
- Network connectivity issues
- Invalid API responses
