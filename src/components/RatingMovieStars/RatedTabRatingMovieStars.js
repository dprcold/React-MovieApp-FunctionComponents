import React from 'react';
import { Rate } from 'antd';
import PropTypes from 'prop-types';

export default function RatedTabRatingMovieStars({ ratingFromServer = 0 }) {
  return <Rate disabled allowHalf count={10} defaultValue={ratingFromServer} />;
}
RatedTabRatingMovieStars.propTypes = {
  ratingFromServer: PropTypes.number.isRequired,
};
