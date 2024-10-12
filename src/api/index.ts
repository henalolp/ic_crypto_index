import express from 'express';

// list of controllers here
import users from '../controllers/users';
// import apikeys from '../controllers/apikeys';
// import ohlc from '../controllers/users';

const api = (storages: any) => {
    const router = express();

    // register api points
    router.use('/users', users(storages));
    // router.use('/apikeys', apikeys(storages));
    // router.use('/ohlc', ohlc(storages));

    return router;
};

export default api;