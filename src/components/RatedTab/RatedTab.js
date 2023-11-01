import React, { useContext, useEffect, useState } from 'react';
import './ratedMovies.css';
import '../SearchInput/SearchInput.css';
import { Pagination } from 'antd';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';

import SessionIdContext from '../contexts/SessionIdContext';
import GenreContext from '../contexts/GenreContext';
import { getGuestSessionRatings } from '../ApiClient/ApiClient';
import MovieCard from '../MovieCard/MovieCard';
import RatedTabRatingMovieStars from '../RatingMovieStars/RatedTabRatingMovieStars';

export default function RatedTab({ updateMovieList }) {
  const [ratedMovies, setRatedMovies] = useState([]);
  const [totalPages, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const sessionId = useContext(SessionIdContext);
  const isRating = false;

  useEffect(() => {
    if (sessionId) {
      getGuestSessionRatings(sessionId, page)
        .then((response) => {
          setRatedMovies(response.results);
          setTotalPage(response.total_pages);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [updateMovieList, page]);

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
  const onChangePage = (page) => {
    setPage(page);
  };
  return (
    <>
      <div className="ratedMovies">
        {ratedMovies &&
          ratedMovies.map((movie) => (
            <MovieCard
              genreData={genreData}
              rating={movie.vote_average}
              key={movie.id}
              img={movie.poster_path}
              tittle={checkTitleLength(movie.original_title)}
              cardDate={formatDate(movie.release_date)}
              genreIdsFromApiClient={movie.genre_ids || []}
              cardText={checkTextLength(movie.overview)}
              RatedTabRatingMovieStars={RatedTabRatingMovieStars}
              idCard={movie.id}
              ratingFromServer={movie.rating}
              isRating={isRating}
            />
          ))}
      </div>
      <div className="cardsPagination">
        <Pagination onChange={onChangePage} current={page} total={totalPages} pageSize={1} showSizeChanger={false} />
      </div>
    </>
  );
}
RatedTab.propTypes = {
  updateMovieList: PropTypes.bool.isRequired,
};
