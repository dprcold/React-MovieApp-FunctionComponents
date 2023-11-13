import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';

import { getGenre } from '../ApiClient/ApiClient';
import { GenreContext } from '../contexts/GenreContext';
import { SearchInput } from '../SearchInput/SearchInput';
import { RatedTab } from '../RatedTab/RatedTab';
import './SwitchTabs.css';

export const SwitchTabs = () => {
  const [genreData, setGenreData] = useState([]);
  const [key, setKey] = useState('1');

  const items = [
    {
      key: '1',
      label: 'Search',
      children: <SearchInput />,
    },
    {
      key: '2',
      label: 'Rated',
      children: <RatedTab updateMovieList={key === '2'} />,
    },
  ];

  useEffect(() => {
    getGenre().then((result) => setGenreData(result));
  }, []);

  return (
    <GenreContext.Provider value={genreData}>
      <div className="switchTabsWrapper">
        <Tabs defaultActiveKey="1" items={items} onTabClick={setKey} />
      </div>
    </GenreContext.Provider>
  );
};
