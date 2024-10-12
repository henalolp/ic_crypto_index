import Router from 'express';
import signup_user from './signup_user';

const users = (storages: any) => {
  const api = Router();

  api.post('/signup', signup_user(storages));

  return api;
};

export default users;