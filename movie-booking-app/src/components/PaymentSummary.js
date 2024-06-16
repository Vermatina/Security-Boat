import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import '../PaymentSummary.css';
import { UserContext } from '../UseContext';

const PaymentSummary = () => {
  const location = useLocation();
  const { title, totalSeats, totalPrice } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    upiId: '',
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { user } = useContext(UserContext);

  const tax = (totalPrice * 0.1).toFixed(2); // Assuming 10% tax
  const serviceCharge = 5.00; // Assuming a flat service charge
  const grandTotal = (parseFloat(totalPrice) + parseFloat(tax) + serviceCharge).toFixed(2);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const handleCardPayment = () => {
    const cardRegex = /^[0-9]{16}$/;
    if (!cardRegex.test(paymentDetails.cardNumber)) {
      alert('Invalid card number. Please enter a valid 16-digit card number.');
      return;
    }
    setPaymentSuccess(true);
    sendReceiptEmail();
  };

  const handleUpiPayment = () => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+$/;
    if (!upiRegex.test(paymentDetails.upiId)) {
      alert('Invalid UPI ID. Please enter a valid UPI ID like "tina@oksbi".');
      return;
    }
    setPaymentSuccess(true);
    sendReceiptEmail();
  };

  const sendReceiptEmail = () => {
    const emailText = `
      Payment Summary
      ---------------------------
      Movie Name: ${title}
      Total Selected Seats: ${totalSeats}
      Total Price: Rs.${totalPrice.toFixed(2)}
      Tax (10%): Rs.${tax}
      Service Charge: Rs.${serviceCharge.toFixed(2)}
      Grand Total: Rs.${grandTotal}
      Payment Method: ${paymentMethod}
      ---------------------------
      Thank you for your purchase!
    `;

    const emailData = {
      email: user.email,
      subject: 'Movie Booking System - Payment Reciept ',
      text: emailText,
    };

    fetch('http://localhost:5000/send-receipt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Email sent successfully:', data);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };

  if (!title) {
    return <div>Error: No movie data found.</div>;
  }

  if (paymentSuccess) {
    return (
      <div className="payment-summary-container">
        <h2>Payment Successful</h2>
        <div className="summary-item">
          <span>Movie Name:</span> <span>{title}</span>
        </div>
        <div className="summary-item">
          <span>Total Selected Seats:</span> <span>{totalSeats}</span>
        </div>
        <div className="summary-item">
          <span>Total Price:</span> <span>Rs.{totalPrice.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span>Tax (10%):</span> <span>Rs.{tax}</span>
        </div>
        <div className="summary-item">
          <span>Service Charge:</span> <span>Rs.{serviceCharge.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span>Grand Total:</span> <span>Rs.{grandTotal}</span>
        </div>
        <div className="summary-item">
          <span>Payment Method:</span> <span>{paymentMethod}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-summary-container">
      <h2>Payment Summary</h2>
      <div className="summary-item">
        <span>Movie Name:</span> <span>{title}</span>
      </div>
      <div className="summary-item">
        <span>Total Selected Seats:</span> <span>{totalSeats}</span>
      </div>
      <div className="summary-item">
        <span>Total Price:</span> <span>Rs.{totalPrice.toFixed(2)}</span>
      </div>
      <div className="summary-item">
        <span>Tax (10%):</span> <span>Rs.{tax}</span>
      </div>
      <div className="summary-item">
        <span>Service Charge:</span> <span>Rs.{serviceCharge.toFixed(2)}</span>
      </div>
      <div className="summary-item">
        <span>Grand Total:</span> <span>Rs.{grandTotal}</span>
      </div>
      <div className="payment-method">
        <h3>Select Payment Method:</h3>
        <div>
          <input
            type="radio"
            id="card"
            name="paymentMethod"
            value="Card"
            onChange={() => handlePaymentMethodChange('Card')}
          />
          <label htmlFor="card">Credit/Debit Card</label>
        </div>
        <div>
          <input
            type="radio"
            id="upi"
            name="paymentMethod"
            value="UPI"
            onChange={() => handlePaymentMethodChange('UPI')}
          />
          <label htmlFor="upi">UPI</label>
        </div>
      </div>
      {paymentMethod === 'Card' && (
        <div className="card-payment">
          <h3>Enter Card Details:</h3>
          <input
            type="text"
            name="cardNumber"
            placeholder="Enter 16-digit card number"
            value={paymentDetails.cardNumber}
            onChange={handleInputChange}
          />
          <button onClick={handleCardPayment}>Proceed to Card Payment</button>
        </div>
      )}
      {paymentMethod === 'UPI' && (
        <div className="upi-payment">
          <h3>Enter UPI ID:</h3>
          <input
            type="text"
            name="upiId"
            placeholder="Enter your UPI ID"
            value={paymentDetails.upiId}
            onChange={handleInputChange}
          />
          <button onClick={handleUpiPayment}>Proceed to UPI Payment</button>
        </div>
      )}
    </div>
  );
};

export default PaymentSummary;
