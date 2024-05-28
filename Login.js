import React, { useState } from 'react';
import axios from 'axios';
import image1 from './image1.jpg'

const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
      const response = await axios.post(url, {
        '@context': [
          'http://schema4i.org/Thing.jsonld',
          'http://schema4i.org/Action.jsonld',
          'http://schema4i.org/SearchAction.jsonld',
        ],
        '@type': 'SearchAction',
        Object: {
          '@context': [
            'http://schema4i.org/Thing.jsonld',
            'http://schema4i.org/Filter',
            'http://schema4i.org/DataLakeItem',
            'http://schema4i.org/UserAccount',
          ],
          '@type': 'Filter',
          FilterItem: {
            '@type': 'DataLakeItem',
            Creator: {
              '@type': 'UserAccount',
              Identifier: 'USERID-4711',
            },
          },
        },
      }, { headers });

      const users = response.data?.Result?.ItemListElement?.map((item) => item.Item) || [];
      const user = users.find((user) => user.About.Email === email && user.About.Password === password);

      if (user) {
        localStorage.setItem('accountNumber', user.About.AccountNumber);
        setError('Login successful');
        // Redirect or handle successful login
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to login. Please try again later.');
    }
  };

  return (
    <div className="loginArea container mt-5">
      <div className="row">
        <div className="loginBody col-md-4">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="Username" className="form-label">Username</label>
              <input type="Username" className="form-control" id="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">email</label>
              <input type="text" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
           </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <button type="submit" className="Loginbutton btn btn-primary">Login</button>
          </form>
        </div>
        <div className="col-md-8">
          <img src = {image1} />
        </div>
      </div>
    </div>
  );
};

export default Login;