import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MovieDetail from './components/Movie';
import PaymentSummary from './components/PaymentSummary';
import './App.css'; 
import { UserProvider } from './UseContext';

const App = () => {
  return (
    <UserProvider>
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Movie Ticket Booking System</h1>
          
        </header>
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/movie/:title" element={<MovieDetail />} />
          <Route path="/payment-summary" element={<PaymentSummary />} />
          </Routes>
      </div>
    </Router>
    </UserProvider>
  );
};

export default App;


