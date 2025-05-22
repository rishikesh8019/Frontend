import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
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
            setError(err.response?.data?.detail || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Drug Design ViT Predictor</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <label htmlFor="smilesInput" className="form-label">Enter SMILES:</label>
                    <input
                        type="text"
                        id="smilesInput"
                        className="form-control"
                        value={smiles}
                        onChange={(e) => setSmiles(e.target.value)}
                        placeholder="e.g., CCO"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Predicting...' : 'Predict'}
                </button>
            </form>

            {error && <div className="alert alert-danger">{error}</div>}

            {result && (
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Prediction Result</h5>
                        <p><strong>SMILES:</strong> {result.smiles}</p>
                        <p><strong>Activity:</strong> {result.activity}</p>
                        {result.image && (
                            <div>
                                <strong>Structure:</strong>
                                <img
                                    src={`data:image/png;base64,${result.image}`}
                                    alt="Molecular Structure"
                                    className="img-fluid mt-2"
                                    style={{ maxWidth: '300px' }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
