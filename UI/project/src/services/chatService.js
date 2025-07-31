// In-memory cache for storing questions and answers
const cache = new Map();

// Regular REST API service using JSONPlaceholder for demo
const apiCall = async (question) => {
  try {
    // Using JSONPlaceholder API as an example - replace with your actual API
    const response = await fetch('https://localhost:8080/ask/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: {"user-input":question},
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const answer = await response.json();
    
    // Process the response - this is where you'd handle your actual API response format
    if (!answer) {
      throw new Error('Invalid response format from API');
    }

    // Generate a response based on the API data
    // In a real scenario, you'd process the actual API response
   return answer;

  } catch (error) {
    console.error('API call failed:', error);
    
    // Handle different types of errors
    if (error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    } else if (error.message.includes('404')) {
      throw new Error('API endpoint not found. Please check the API URL.');
    } else if (error.message.includes('500')) {
      throw new Error('Server error. Please try again later.');
    } else {
      throw new Error('Failed to get response from API. Please try again.');
    }
  }
};

export const chatService = {
  // Get answer for a question (checks cache first)
  async getAnswer(question) {
    const normalizedQuestion = question.toLowerCase().trim();
    
    // Check if answer exists in cache
    if (cache.has(normalizedQuestion)) {
      return {
        answer: cache.get(normalizedQuestion),
        fromCache: true
      };
    }
    
    try {
      // Make real API call if not in cache
      const answer = await apiCall(question);
      
      // Store in cache
      cache.set(normalizedQuestion, answer);
      
      return {
        answer,
        fromCache: false
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Get cache statistics (for debugging/monitoring)
  getCacheStats() {
    return {
      size: cache.size,
      keys: Array.from(cache.keys())
    };
  },
  
  // Clear cache if needed
  clearCache() {
    cache.clear();
  }
};