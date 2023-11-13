import React from 'react';
import { Rate } from 'antd';
import PropTypes from 'prop-types';

export function RatedTabRatingMovieStars({ ratingFromServer = 0 }) {
  return <Rate disabled allowHalf count={10} defaultValue={ratingFromServer} />;
}
RatedTabRatingMovieStars.propTypes = {
  ratingFromServer: PropTypes.number.isRequired,
};
