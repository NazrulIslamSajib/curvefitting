import React, { useState } from 'react';

function RegressionCalculator({ type }) {
  const [n, setN] = useState(2);
  const [xData, setXData] = useState(Array(20).fill(''));
  const [yData, setYData] = useState(Array(20).fill(''));
  const [result, setResult] = useState('');

  // Handle input change for x or y
  const handleInputChange = (index, value, dataType) => {
    if (dataType === 'x') {
      const newXData = [...xData];
      newXData[index] = value;
      setXData(newXData);
    } else {
      const newYData = [...yData];
      newYData[index] = value;
      setYData(newYData);
    }
  };

  const handleCalculate = () => {
    const nVal = parseInt(n);
    const xArr = xData.slice(0, nVal).map(parseFloat);
    const yArr = yData.slice(0, nVal).map(parseFloat);

    if (xArr.some(isNaN) || yArr.some(isNaN)) {
      setResult('Please enter valid numbers.');
      return;
    }

    if (type === 'linear') {
      const resultStr = linearRegression(xArr, yArr);
      setResult(resultStr);
    } else if (type === 'parabola') {
      const resultStr = parabolaRegression(xArr, yArr);
      setResult(resultStr);
    } else if (type === 'exponential') {
      const resultStr = exponentialRegression(xArr, yArr);
      setResult(resultStr);
    }
  };

  const generateInputs = () => {
    const inputs = [];
    for (let i = 0; i < n; i++) {
      inputs.push(
        <div key={i} className="input-row">
          <input
            type="number"
            placeholder={`x[${i + 1}]`}
            value={xData[i]}
            onChange={(e) => handleInputChange(i, e.target.value, 'x')}
          />
          <input
            type="number"
            placeholder={`y[${i + 1}]`}
            value={yData[i]}
            onChange={(e) => handleInputChange(i, e.target.value, 'y')}
          />
        </div>
      );
    }
    return inputs;
  };

  // Regression functions

  // 1. Linear Regression
  function linearRegression(x, y) {
    const n = x.length;
    let sumX = 0, sumY = 0, sumX2 = 0, sumXY = 0;
    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
      sumX2 += x[i] * x[i];
      sumXY += x[i] * y[i];
    }
    const denominator = n * sumX2 - sumX * sumX;
    if (denominator === 0) return 'Cannot compute linear regression (denominator=0).';

    const a = (sumY * sumX2 - sumX * sumXY) / denominator;
    const b = (n * sumXY - sumX * sumY) / denominator;

    return `y = ${a.toFixed(4)} + ${b.toFixed(4)} x`;
  }

  // 2. Parabola Regression (Quadratic)
  function parabolaRegression(x, y) {
    const n = x.length;
    let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0;
    let sumY = 0, sumXY = 0, sumX2Y = 0;

    for (let i = 0; i < n; i++) {
      const xi = x[i], yi = y[i];
      const xi2 = xi * xi;
      const xi3 = xi2 * xi;
      const xi4 = xi2 * xi2;
      sumX += xi;
      sumX2 += xi2;
      sumX3 += xi3;
      sumX4 += xi4;
      sumY += yi;
      sumXY += xi * yi;
      sumX2Y += xi2 * yi;
    }

    const d = determinant3x3([
      [n, sumX, sumX2],
      [sumX, sumX2, sumX3],
      [sumX2, sumX3, sumX4],
    ]);

    if (Math.abs(d) < 1e-12) return 'Singular matrix, parabola fitting not possible.';

    const A = determinant3x3([
      [sumY, sumX, sumX2],
      [sumXY, sumX2, sumX3],
      [sumX2Y, sumX3, sumX4],
    ]) / d;

    const B = determinant3x3([
      [n, sumY, sumX2],
      [sumX, sumXY, sumX3],
      [sumX2, sumX2Y, sumX4],
    ]) / d;

    const C = determinant3x3([
      [n, sumX, sumY],
      [sumX, sumX2, sumXY],
      [sumX2, sumX3, sumX2Y],
    ]) / d;

    return `y = ${A.toFixed(4)} + ${B.toFixed(4)} x + ${C.toFixed(4)} x^2`;
  }

  // Determinant of 3x3 matrix
  function determinant3x3(mat) {
    return (
      mat[0][0] * (mat[1][1] * mat[2][2] - mat[1][2] * mat[2][1]) -
      mat[0][1] * (mat[1][0] * mat[2][2] - mat[1][2] * mat[2][0]) +
      mat[0][2] * (mat[1][0] * mat[2][1] - mat[1][1] * mat[2][0])
    );
  }

  // 3. Exponential Regression: y = a * e^{b x}
  function exponentialRegression(x, y) {
    const n = x.length;
    let sumLogY = 0, sumX = 0, sumX2 = 0, sumXLogY = 0;

    for (let i = 0; i < n; i++) {
      if (y[i] <= 0) return 'Y values must be positive for exponential regression.';
      const logY = Math.log(y[i]);
      sumLogY += logY;
      sumX += x[i];
      sumX2 += x[i] * x[i];
      sumXLogY += x[i] * logY;
    }

    const denominator = n * sumX2 - sumX * sumX;
    if (denominator === 0) return 'Cannot compute exponential regression (denominator=0).';

    const b = (n * sumXLogY - sumX * sumLogY) / denominator;
    const logA = (sumLogY - b * sumX) / n;
    const a = Math.exp(logA);

    return `Y = ${a.toFixed(4)} * e^{${b.toFixed(4)} x}`;
  }

  return (
    <div className="calculator">
      <div className="input-group">
        <label>Number of data points (n): </label>
        <input
          type="number"
          min={2}
          max={20}
          value={n}
          onChange={(e) => setN(e.target.value)}
        />
      </div>
      <div className="inputs">{generateInputs()}</div>
      <button className="calculate-btn" onClick={handleCalculate}>Calculate</button>
      <div className="result">
        <h2>Result:</h2>
        <pre>{result}</pre>
      </div>
    </div>
  );
}

export default RegressionCalculator;
