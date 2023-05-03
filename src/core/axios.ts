import axios, { CreateAxiosDefaults } from 'axios';

const defaultConfigs: CreateAxiosDefaults = {
  baseURL: process.env.REACT_APP_BUDGET_MANAGEMENT_API,
  withCredentials: true,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
};

const instance = axios.create(defaultConfigs);

export default instance;
