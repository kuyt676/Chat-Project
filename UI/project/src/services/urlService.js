// Service for handling URL submissions
const urlService = {
  // Validate URL format
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Submit URL to API
  async submitUrl(url) {
    try {
      const response = await fetch('https://localhost:8080/analyze/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "url": url,
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result) {
        throw new Error('Invalid response format from API');
      }

      return {
        success: true,
        data: result,
        message: 'URL submitted successfully'
      };

    } catch (error) {
      console.error('URL submission failed:', error);
      
      if (error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      } else if (error.message.includes('404')) {
        throw new Error('API endpoint not found. Please check the API URL.');
      } else if (error.message.includes('500')) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error('Failed to submit URL. Please try again.');
      }
    }
  }
};

export default urlService;