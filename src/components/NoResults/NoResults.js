import React from 'react';
import { Alert, Space } from 'antd';
const NoResults = () => (
  <Space
    direction="vertical"
    style={{
      width: '100%',
    }}
  >
    <Alert message="Oops... No results found :(" type="info" showIcon closable />
  </Space>
);
export default NoResults;
