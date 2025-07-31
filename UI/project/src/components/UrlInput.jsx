import React, { useState } from 'react';
import { Send, Loader2, Link, CheckCircle, XCircle } from 'lucide-react';
import urlService from '../services/urlService';

const UrlInput = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [submitResult, setSubmitResult] = useState(null);

  const validateUrl = (inputUrl) => {
    if (!inputUrl.trim()) {
      return 'URL is required';
    }
    
    if (!urlService.isValidUrl(inputUrl)) {
      return 'Please enter a valid URL (e.g., https://example.com)';
    }
    
    return '';
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setValidationError('');
    setSubmitResult(null);
    
    // Real-time validation
    if (newUrl.trim()) {
      const error = validateUrl(newUrl);
      setValidationError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const error = validateUrl(url);
    if (error) {
      setValidationError(error);
      return;
    }

    setIsLoading(true);
    setSubmitResult(null);

    try {
      const result = await urlService.submitUrl(url);
      setSubmitResult({
        success: true,
        message: result.message,
        data: result.data
      });
      setUrl(''); // Clear input on success
    } catch (error) {
      setSubmitResult({
        success: false,
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValidInput = url.trim() && !validationError;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Link className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Submit URL
          </h1>
          <p className="text-gray-600">
            Enter a URL to process and submit to our system
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <div className="relative">
              <input
                type="text"
                id="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://example.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  validationError 
                    ? 'border-red-300 bg-red-50' 
                    : isValidInput 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {isValidInput && (
                <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
              )}
              {validationError && (
                <XCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
              )}
            </div>
            
            {/* Validation Error */}
            {validationError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {validationError}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValidInput || isLoading}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit URL
              </>
            )}
          </button>
        </form>

        {/* Result Message */}
        {submitResult && (
          <div className={`mt-6 p-4 rounded-lg ${
            submitResult.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {submitResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <p className={`text-sm font-medium ${
                submitResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {submitResult.message}
              </p>
            </div>
            
            {submitResult.success && submitResult.data && (
              <div className="mt-3 text-xs text-green-700">
                <p>Response ID: {submitResult.data.id}</p>
                <p>Processed at: {new Date().toLocaleString()}</p>
              </div>
            )}
          </div>
        )}

        {/* Example URLs */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-2">Example URLs:</p>
          <div className="space-y-1">
            {['https://example.com', 'https://github.com/user/repo', 'https://docs.example.com/api'].map((exampleUrl) => (
              <button
                key={exampleUrl}
                type="button"
                onClick={() => setUrl(exampleUrl)}
                className="block w-full text-xs text-blue-500 hover:text-blue-700 hover:underline"
                disabled={isLoading}
              >
                {exampleUrl}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlInput;