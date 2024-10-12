import { ic } from 'azle';
import { v4 as uuidv4 } from 'uuid';
import { curry } from 'lodash';

class User {
  id: string;                                                                           // Unique identifier for the user
  username: string;                                                                     // Username of the user
  password: string;                                                                     // Password of the user
  mail: string;                                                                         // Email address of the user
  createdAt: Date;                                                                      // Date when the user was created

  // Constructor to initialize a User object
  constructor(id: string, username: string, password: string, mail: string, createdAt: Date) {
      this.id = id;
      this.username = username;
      this.password = password;
      this.mail = mail;
      this.createdAt = createdAt;
  }
}


const STATUSES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
};

const sendResponse = (res: any, data: any, status = STATUSES.SUCCESS) => res.status(status).json(data).end();


const sendOne = curry((res: any, entity: any) => {
  if (!entity) {
    throw new Error('Not Found');
  }

  return sendResponse(res, entity);
});

const signup_user = (storages: any) => async (req: any, res: any, next: any) => {
  console.log('signup user')
  try {
    const { UserStorage } = storages;
    let { username, password, mail } = req.body;
    let newUser = new User(uuidv4(), username, password, mail, getCurrentDate());
    UserStorage.insert(newUser.id, newUser);

    console.log('signup user end...')
    return sendOne(res, { newUser });
  } catch (error) {
    console.log('error', error)
    next(error);
  }
}

export default signup_user;

function getCurrentDate() {
  const timestamp = new Number(ic.time());
  return new Date(timestamp.valueOf() / 1000_000);
}