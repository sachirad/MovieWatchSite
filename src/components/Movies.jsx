import React, { useState, useEffect } from "react";

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const apiKey = "20fb31569ed9af9b1523d29a4fe602d0";
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
      );
      const data = await response.json();
      setMovies(data.results);
    };
    fetchMovies();
  }, []);

  return (
    <div className="bg-gray-100 p-6 movie-card">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Popular Movies</h1>
      <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <li
            key={movie.id}
            className="p-4 bg-white shadow-lg rounded-lg transform hover:scale-105 transition duration-300 ease-in-out"
          >
            {/* <h2>{movie.title}</h2> */}
            <h3>{movie.title}</h3>
            <p className="text-gray-600 text-sm">
              Release Date: {movie.release_date || "N/A"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieList;
