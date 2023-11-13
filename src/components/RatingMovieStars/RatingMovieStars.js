import React from 'react';
import { Rate } from 'antd';

export function RatingMovieStars({ rateStars = 0, setRateStars }) {
  return <Rate allowHalf defaultValue={rateStars} count={10} onChange={(newRate) => setRateStars(newRate)} />;
}
