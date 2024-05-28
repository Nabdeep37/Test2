import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import image2 from './image2.jpg'; 

const Signup = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const url = 'https://json-storage-api.p.rapidapi.com/datalake';
    const headers = {
      'content-type': 'application/json',
      'x-rapidapi-key': '3106896c28msh0505e01ebf8fe18p1bc25fjsn1f6cd90cbb0b',
      'x-rapidapi-host': 'json-storage-api.p.rapidapi.com'
    };

    try {
      const response = await axios.post(url, { name, email, password }, { headers });

      if (onSignup) {
        onSignup();
      }

      // Navigate to the dashboard after successful signup
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Failed to sign up. Please try again later.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img src={image2} className="signup-image" alt="Signup Illustration" />
        </div>
        <div className="col-md-6">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
