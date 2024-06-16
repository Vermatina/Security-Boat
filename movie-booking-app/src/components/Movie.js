import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Movie.css';

const MovieDetail = () => {
  const { title } = useParams();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState({
    silver: [],
    gold: [],
    sofa: []
  });

  const categories = {
    silver: { name: 'Royal Silver', seats: 50, price: 100 },
    gold: { name: 'Royal Gold', seats: 30, price: 200 },
    sofa: { name: 'Royal Sofa', seats: 20, price: 350 }
  };

  const toggleSeatSelection = (category, seatNumber) => {
    setSelectedSeats(prevSelectedSeats => ({
      ...prevSelectedSeats,
      [category]: prevSelectedSeats[category].includes(seatNumber)
        ? prevSelectedSeats[category].filter(seat => seat !== seatNumber)
        : [...prevSelectedSeats[category], seatNumber]
    }));
  };

  const getTotalSelectedSeats = () => {
    return Object.values(selectedSeats).reduce((total, seats) => total + seats.length, 0);
  };

  const getTotalPrice = () => {
    return Object.keys(categories).reduce((total, category) => {
      return total + selectedSeats[category].length * categories[category].price;
    }, 0);
  };

  const handleNextClick = () => {
    if (getTotalSelectedSeats() === 0) {
      alert('Please select at least one seat before proceeding.');
    } else {
      navigate('/payment-summary', {
        state: {
          title,
          selectedSeats,
          totalSeats: getTotalSelectedSeats(),
          totalPrice: getTotalPrice()
        }
      });
    }
  };

  return (
    <div className="movie-detail">
      <h2>{title}</h2>
      {Object.keys(categories).map(category => (
        <div key={category} className="category-container">
          <h3>{categories[category].name} - Rs.{categories[category].price}</h3>
          <div className="seats-container">
            {Array.from({ length: categories[category].seats }, (_, index) => index + 1).map(seat => (
              <div
                key={seat}
                className={`seat ${selectedSeats[category].includes(seat) ? 'selected' : ''}`}
                onClick={() => toggleSeatSelection(category, seat)}
              >
                {seat}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="total-selected-seats">
        <h3>Total Selected Seats: {getTotalSelectedSeats()}</h3>
      </div>
      <button onClick={handleNextClick}>Next</button>
    </div>
  );
};

export default MovieDetail;
