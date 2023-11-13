import React, { useState, useEffect, useContext } from 'react';
import { Input, Pagination } from 'antd';
import { Offline } from 'react-detect-offline';
import { useDebouncedCallback } from 'use-debounce';

import { SessionIdContext } from '../contexts/SessionIdContext';
import { NoResults } from '../NoResults/NoResults';
import { OfflineError } from '../OfflineError/OfflineError';
import { AlertError } from '../AlertError/AlertError';
import { getMovie, getGuestSessionRatings } from '../ApiClient/ApiClient';
import './SearchInput.css';
import { MovieWrapper } from '../Wrapper/MovieWrapper';

export const SearchInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [showPagination, setShowPagination] = useState(false);
  const [currentPagination, setCurrentPagination] = useState(1);
  const [pagesNum, setPagesNum] = useState(0);
  const [dataWithRatedMovies, setDataWithRatedMovies] = useState([]);
  const sessionId = useContext(SessionIdContext);

  const onFocusChange = () => {
    setShowPagination(false);
  };
  const onBlurChange = () => {
    setShowPagination(true);
  };

  useEffect(() => {
    setLoading(false);
  }, [results]);

  const searchMovies = async (query, pageNumber) => {
    setLoading(true);
    try {
      if (sessionId) {
        const getRatedMovies = await getGuestSessionRatings(sessionId, pageNumber);
        const getRatedMoviesData = getRatedMovies.results;
        setDataWithRatedMovies(getRatedMoviesData);
      }
      const response = await getMovie(query, pageNumber);
      const resultArray = response.results;
      const pages = response.total_pages;
      setPagesNum(pages);
      setResults(resultArray);

      if (resultArray.length === 0) {
        setCurrentPagination(1);
        setShowNoResults(true);
        setError(false);
        setLoading(false);
        setShowPagination(false);
      } else {
        setShowPagination(true);
        setShowNoResults(false);
      }
    } catch (error) {
      setShowNoResults(false);
      setError(true);
      setLoading(false);
      setShowPagination(false);
    } finally {
      setLoading(false);
    }
  };

  const onChangePage = (page) => {
    setCurrentPagination(page);
  };
  const debounced = useDebouncedCallback((value) => {
    setInputValue(value);
  }, 1000);

  useEffect(() => {
    if (inputValue.trim() === '') {
      setCurrentPagination(1);
      setShowNoResults(false);
      setError(false);
      setShowPagination(false);
      return;
    }
    if (debounced) {
      searchMovies(inputValue, currentPagination);
    }
  }, [inputValue, currentPagination]);

  return (
    <div className="input-wrapper">
      <Input
        placeholder="Type to search..."
        onChange={(event) => debounced(event.target.value)}
        onFocus={onFocusChange}
        onBlur={onBlurChange}
      />
      <Offline>
        <OfflineError />
      </Offline>
      {error ? (
        <AlertError />
      ) : (
        <MovieWrapper results={results} loading={loading} dataWithRatedMovies={dataWithRatedMovies} />
      )}
      {showNoResults ? <NoResults /> : null}
      {showPagination && !loading && (
        <div className="cardsPagination">
          <Pagination
            current={currentPagination}
            onChange={onChangePage}
            total={pagesNum}
            showSizeChanger={false}
            pageSize={1}
          />
        </div>
      )}
    </div>
  );
};
