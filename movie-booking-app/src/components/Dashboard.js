import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "../Dashboard.css";
import { UserContext } from "../UseContext"; // Adjust the import path if needed

const Dashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?s=batman&apikey=99c4fb7e`
      );
      setMovies(response.data.Search);
    } catch (error) {
      console.error("Error fetching the movies", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMovieClick = (title) => {
    navigate(`/movie/${title}`);
  };

  const handleLogout = () => {
    // Clear user context
    setUser(null);
    // Clear local storage
    localStorage.removeItem("userData");
    // Redirect to login page
    navigate("/login");
  };

  const filteredMovies = movies.filter((movie) =>
    movie.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logout-icon" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </div>
      </header>
      <h1>Welcome, {user.name}!</h1>
      <input
        type="text"
        placeholder="Search movies"
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="movie-grid">
        {filteredMovies.map((movie) => (
          <div
            key={movie.imdbID}
            className="movie-card"
            onClick={() => handleMovieClick(movie.Title)}
          >
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
            <img src={movie.Poster} alt={movie.Title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
