import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [smiles, setSmiles] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await axios.post('https://cors-anywhere.herokuapp.com/http://16.171.160.20:8000/predict/vit', { SMILES: smiles });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Drug Design ViT Predictor</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="smilesInput" className="block text-sm font-medium text-gray-700 mb-2">
              Enter SMILES String
            </label>
            <input
              type="text"
              id="smilesInput"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={smiles}
              onChange={(e) => setSmiles(e.target.value)}
              placeholder="e.g., CCO"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold transition duration-200 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Predicting...
              </span>
            ) : (
              'Predict'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-lg animate-fade-in">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Prediction Result</h2>
            <div className="space-y-4">
              <p>
                <span className="font-medium">SMILES:</span> {result.smiles}
              </p>
              <p>
                <span className="font-medium">Activity:</span> {result.activity}
              </p>
              {result.image && (
                <div>
                  <span className="font-medium">Structure:</span>
                  <img
                    src={`data:image/png;base64,${result.image}`}
                    alt="Molecular Structure"
                    className="mt-2 max-w-full h-auto rounded-lg shadow-md"
                    style={{ maxWidth: '300px' }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
