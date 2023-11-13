import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { SessionIdContext } from '../contexts/SessionIdContext';
import { addRatingPost } from '../ApiClient/ApiClient';
import './MovieCard.css';
const calculateRatingRound = (rating) => Math.ceil(rating * 10) / 10;

export function MovieCard({
  img = '',
  tittle = '',
  cardDate = '',
  cardText = '',
  rating = 0,
  genreIdsFromApiClient = [],
  genreData = [],
  RatingMovieStars = null,
  RatedTabRatingMovieStars = null,
  idCard = 0,
  ratingFromServer = 0,
  isRating = false,
  dataWithRatedMovies = [],
}) {
  const findRatingMovie = (movieId, data) => {
    if (data) {
      const movie = data.find((ratedMovie) => ratedMovie.id === movieId);
      return movie ? movie.rating : 0;
    } else {
      return 0;
    }
  };
  const [rateStars, setRateStars] = useState(findRatingMovie(idCard, dataWithRatedMovies));
  const sessionId = useContext(SessionIdContext);

  useEffect(() => {
    const fetchData = async () => {
      if (rateStars > 0) {
        try {
          await addRatingPost(sessionId, idCard, rateStars);
          setRateStars(0);
        } catch (error) {
          throw new Error('error add rating to server');
        }
      }
    };

    fetchData();
  }, [rateStars]);

  const ratingRound = calculateRatingRound(rating);
  const colorRaitng = (number) => {
    if (number < 3) {
      return '#E90000';
    } else if (number >= 3 && number < 5) {
      return '#E97E00';
    } else if (number >= 5 && number < 7) {
      return '#E9D100';
    } else if (number >= 7) {
      return '#66E900';
    }
  };

  return (
    <div className="movie-wrapper">
      <img
        src={`https://image.tmdb.org/t/p/w500${img}`}
        alt="Oops..."
        className="card-img"
        onError={(e) => {
          e.target.src = 'https://i.postimg.cc/mkx5TMQS/Error-Code-5-1.jpg';
        }}
      />
      <div className="text-wrapper">
        <h1 className="movie-tittle">{tittle}</h1>
        <div className="circle" style={{ border: `2px solid ${colorRaitng(ratingRound)}` }}>
          {ratingRound}
        </div>
        <span className="card-date">{cardDate}</span>
        <div className="card-genre-wrapper">
          {genreData
            .filter((item) => {
              return genreIdsFromApiClient.includes(item.id);
            })
            .map((item) => {
              return (
                <div key={item.id} className="card-genre">
                  {item.name}
                </div>
              );
            })
            .slice(0, 3)}
        </div>
        <div className="card-text">{cardText}</div>
        <div className="card-stars">
          {isRating ? (
            <RatingMovieStars rateStars={rateStars} setRateStars={setRateStars} />
          ) : (
            <RatedTabRatingMovieStars ratingFromServer={ratingFromServer} />
          )}
        </div>
      </div>
    </div>
  );
}

MovieCard.propTypes = {
  img: PropTypes.string,
  tittle: PropTypes.string.isRequired,
  cardDate: PropTypes.string,
  cardText: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  genreIdsFromApiClient: PropTypes.array.isRequired,
  genreData: PropTypes.array.isRequired,
  RatingMovieStars: PropTypes.func,
  idCard: PropTypes.number.isRequired,
  ratingFromServer: PropTypes.number,
  isRating: PropTypes.bool.isRequired,
  dataWithRatedMovies: PropTypes.array,
};
