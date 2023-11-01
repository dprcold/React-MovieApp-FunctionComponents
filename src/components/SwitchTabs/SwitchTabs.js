import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';

import { getGenre } from '../ApiClient/ApiClient';
import GenreContext from '../contexts/GenreContext';
import SearchInput from '../SearchInput/SearchInput';
import RatedTab from '../RatedTab/RatedTab';
import './SwitchTabs.css';

const SwitchTabs = () => {
  const [genreData, setGenreData] = useState([]);
  const [updateMovieList, setUpdateMovieList] = useState(false);

  const items = [
    {
      key: '1',
      label: 'Search',
      children: <SearchInput />,
    },
    {
      key: '2',
      label: 'Rated',
      children: <RatedTab updateMovieList={updateMovieList} />,
    },
  ];

  const handleClickOnTab = (key) => {
    if (key === '2') {
      setUpdateMovieList(true);
    }
    if (key === '1') {
      setUpdateMovieList(false);
    }
  };

  useEffect(() => {
    getGenre().then((result) => setGenreData(result));
  }, []);

  return (
    <GenreContext.Provider value={genreData}>
      <div className="switchTabsWrapper">
        <Tabs defaultActiveKey="1" items={items} onTabClick={handleClickOnTab} />
      </div>
    </GenreContext.Provider>
  );
};
export default SwitchTabs;
