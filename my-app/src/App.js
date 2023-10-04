import React from 'react';
import HomePage from './pages/HomePage';

import { BrowserRouter as Router, Route } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <Router>
        <Route exact path="/" component={HomePage} />
      </Router>
    </div>
  );
};

export default App;
