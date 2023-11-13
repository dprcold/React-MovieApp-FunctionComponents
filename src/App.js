import React, { useState, useEffect } from 'react';

import { SessionIdContext } from './components/contexts/SessionIdContext';
import { SwitchTabs } from './components/SwitchTabs/SwitchTabs';
import { createGuestSession } from './components/ApiClient/ApiClient';
function App() {
  const [userSessionId, setUserSessionId] = useState('');
  useEffect(() => {
    const checkSessionId = localStorage.getItem('userSessionId');
    if (checkSessionId) {
      setUserSessionId(checkSessionId);
    } else {
      createGuestSession().then((result) => {
        setUserSessionId(result);
        localStorage.setItem('userSessionId', result);
      });
    }
  }, []);
  return (
    <SessionIdContext.Provider value={userSessionId}>
      <SwitchTabs />
    </SessionIdContext.Provider>
  );
}
export default App;
