import React from 'react'
import { useState } from 'react'
import ChatScreen from './components/ChatScreen'
import UrlInput from './components/UrlInput'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('chat'); // 'chat' or 'url'

  return (
    <div className="App">
      {currentScreen === 'chat' ? (
        <div>
          <div className="fixed top-4 right-4 z-10">
            <button
              onClick={() => setCurrentScreen('url')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Submit URL
            </button>
          </div>
          <ChatScreen />
        </div>
      ) : (
        <div>
          <div className="fixed top-4 left-4 z-10">
            <button
              onClick={() => setCurrentScreen('chat')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              Back to Chat
            </button>
          </div>
          <UrlInput />
        </div>
      )}
    </div>
  )
}

export default App
