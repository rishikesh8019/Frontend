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
      const response = await axios.post('https://drugggen.onrender.com/predict/vit', { SMILES: smiles });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">Drug Design ViT Predictor</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="smilesInput" className="form-label">Enter SMILES String</label>
            <input
              type="text"
              id="smilesInput"
              className="form-input"
              value={smiles}
              onChange={(e) => setSmiles(e.target.value)}
              placeholder="e.g., CCO"
              required
            />
          </div>
          <button
            type="submit"
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-content">
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="spinner-path"
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
          <div className="error-message animate-fade-in">
            {error}
          </div>
        )}

        {result && (
          <div className="result-card animate-fade-in">
            <h2 className="result-title">Prediction Result</h2>
            <div className="result-content">
              <p><span className="result-label">SMILES:</span> {result.smiles}</p>
              <p><span className="result-label">Activity:</span> {result.activity}</p>
              {result.image && (
                <div>
                  <span className="result-label">Structure:</span>
                  <img
                    src={`data:image/png;base64,${result.image}`}
                    alt="Molecular Structure"
                    className="result-image"
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
