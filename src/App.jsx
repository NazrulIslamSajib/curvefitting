import React, { useState } from 'react';
import RegressionCalculator from './RegressionCalculator';
import './styles.css';

function App() {
  const [regressionType, setRegressionType] = useState('linear');

  return (
    <div className="container">
      <h1>Curve Fitting</h1>
      
      <div className="selector">
        <button onClick={() => setRegressionType('linear')}>Linear Regression</button>
        <button onClick={() => setRegressionType('parabola')}>Parabola Regression</button>
        <button onClick={() => setRegressionType('exponential')}>Exponential Regression</button>
      </div>
      
      <RegressionCalculator type={regressionType} />
    </div>
  );
}

export default App;
