import React from 'react';
import HomePage from './pages/HomePage';

import { BrowserRouter as Router, Route } from 'react-router-dom';
// Removed import statement for React since it has already been imported in the previous code block

// Removed import statement for HomePage since it has already been imported in the previous code block

const App = () => {
  return (
    <div>
      <Router>
        <Route path="/" component={HomePage} />
      </Router>
    </div>
  );
};

export default App;

