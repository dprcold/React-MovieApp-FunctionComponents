import React from 'react';
import { Alert, Space } from 'antd';
export const OfflineError = () => (
  <Space
    direction="vertical"
    style={{
      width: '100%',
    }}
  >
    <Alert
      message="Oops... It seems you're offline. Please check your internet connection"
      type="warning"
      showIcon
      closable
    />
  </Space>
);
