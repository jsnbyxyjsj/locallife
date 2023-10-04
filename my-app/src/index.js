import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Route path="/" component={HomePage} />
    </Router>
  </React.StrictMode>
);
reportWebVitals();

    <Router>
      <Route path="/" component={HomePage} />
    </Router>
  </React.StrictMode>
);
reportWebVitals();
