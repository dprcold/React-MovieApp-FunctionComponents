import React from 'react';
import { Alert, Space } from 'antd';

export const AlertError = () => (
  <Space
    direction="vertical"
    style={{
      width: '100%',
      paddingTop: '20px',
    }}
  >
    <Alert
      message="Oops.."
      description="Something went wrong. Please try again later."
      type="error"
      showIcon
      closable
    />
  </Space>
);
