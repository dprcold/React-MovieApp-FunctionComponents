import React, { useContext } from 'react';
import { Spin } from 'antd';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';

import { RatingMovieStars } from '../RatingMovieStars/RatingMovieStars';
import { GenreContext } from '../contexts/GenreContext';
import './Wrapper.css';
import { MovieCard } from '../MovieCard/MovieCard';

export function MovieWrapper({ results = [], loading = false, dataWithRatedMovies = [] }) {
  const isRating = true;
  const checkTextLength = (text) => {
    let arrayFromText = text.split(' ');
    if (arrayFromText.length > 15) {
      return arrayFromText.slice(0, 15).join(' ') + '...';
    } else {
      return text;
    }
  };
  const checkTitleLength = (title) => {
    let arrayFromTittle = title.split(' ');
    if (arrayFromTittle.length > 3) {
      return arrayFromTittle.slice(0, 5).join(' ') + '...';
    } else {
      return title;
    }
  };
  const formatDate = (date) => {
    if (date) {
      const parseDate = parseISO(date);
      return format(parseDate, 'MMMM d, yyyy');
    }
  };
  const genreData = useContext(GenreContext);

  return (
    <div className="wrapper">
      {loading ? (
        <div className="spin">
          <Spin size="large" />
        </div>
      ) : (
        results &&
        results.map((movie) => (
          <MovieCard
            genreData={genreData}
            rating={movie.vote_average}
            key={movie.id}
            img={movie.poster_path}
            tittle={checkTitleLength(movie.original_title)}
            cardDate={formatDate(movie.release_date)}
            genreIdsFromApiClient={movie.genre_ids || []}
            cardText={checkTextLength(movie.overview)}
            RatingMovieStars={RatingMovieStars}
            idCard={movie.id}
            isRating={isRating}
            dataWithRatedMovies={dataWithRatedMovies}
          />
        ))
      )}
    </div>
  );
}
MovieWrapper.propTypes = {
  results: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  dataWithRatedMovies: PropTypes.array,
};
