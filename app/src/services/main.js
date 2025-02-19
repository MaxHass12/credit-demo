import axios from 'axios';

export const getRoot = () => {
  const { data } = axios.get('/api');
  return data;
};
