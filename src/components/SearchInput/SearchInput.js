import React, { useState, useEffect, useRef, useContext } from 'react';
import { Input, Pagination } from 'antd';
import { Offline } from 'react-detect-offline';
import debounce from 'lodash.debounce';

import SessionIdContext from '../contexts/SessionIdContext';
import NoResults from '../NoResults/NoResults';
import OfflineError from '../OfflineError/OfflineError';
import AlertError from '../AlertError/AlertError';
import { getMovie, getGuestSessionRatings } from '../ApiClient/ApiClient';
import './SearchInput.css';
import MovieWrapper from '../Wrapper/MovieWrapper';

const SearchInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
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

  const debouncedInput = useRef(debounce((value) => setDebouncedValue(value), 700));

  useEffect(() => {
    if (inputValue.trim() === '') {
      setCurrentPagination(1);
      setShowNoResults(false);
      setError(false);
      setShowPagination(false);
    }
    debouncedInput.current(inputValue);
  }, [inputValue]);

  const searchMovies = async (query, pageNumber) => {
    setLoading(true);
    try {
      const getRatedMovies = await getGuestSessionRatings(sessionId, pageNumber);
      const getRatedMoviesData = getRatedMovies.results;
      const response = await getMovie(query, pageNumber);
      const resultArray = response.results;
      const pages = response.total_pages;
      setDataWithRatedMovies(getRatedMoviesData);
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

  useEffect(() => {
    if (debouncedValue) {
      searchMovies(debouncedValue, currentPagination);
    }
  }, [debouncedValue, currentPagination]);

  const onChangePage = (page) => {
    setCurrentPagination(page);
  };

  return (
    <div className="input-wrapper">
      <Input
        placeholder="Type to search..."
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
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

export default SearchInput;
