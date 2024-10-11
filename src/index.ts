import { v4 as uuidv4 } from 'uuid';
import { Server, StableBTreeMap, ic } from 'azle';
import express from 'express';


class Crypto {
  id: string;                                                                           // Unique identifier for the user
  symbol: string;                                                                     // Username of the user
  open: number;                                                                     // Password of the user
  close: number;                                                                         // Email address of the user
  high: number;                                                                         // Email address of the user
  low: number;                                                                         // Email address of the user
  idx_date: Date;                                                                      // Date when the user was created
  createdAt: Date;                                                                      // Date when the user was created

  // Constructor to initialize a User object
  constructor(
    id: string,
    symbol: string,
    open: number,
    close: number,
    high: number,
    low: number,
    idx_date: Date,
    createdAt: Date) {
      this.id = id;
      this.symbol = symbol;
      this.open = open;
      this.close = close;
      this.high = high;
      this.low = low;
      this.idx_date = idx_date;
      this.createdAt = createdAt;
  }
}


const cryptoStorage = StableBTreeMap<string, Crypto>(0);

export default Server(() => {
   const app = express();
   app.use(express.json());

   app.post("/ohlc", (req, res) => {
    console.log('...req.body', {...req.body});
      const crypto: Crypto =  {id: uuidv4(), createdAt: getCurrentDate(), ...req.body};
      cryptoStorage.insert(crypto.id, crypto);
      res.json(crypto);
   });

   app.get("/ohlc/:id", (req, res) => {
    //console.log('req', req);
    // const symbol: any = req.params.symbol;
    // console.log('symbol', symbol);

    // let query: any = {};
    // if (symbol) query['symbol'] = symbol;
    // console.log('query', query);
    const id = req.params.id;

    let values = cryptoStorage.values();

    const record = cryptoStorage.get(id).Some;

    const crypto_details = {
      id: record?.id,
      symbol: record?.symbol,
      idx_date: record?.idx_date,
    }

    console.log('crypto_details', crypto_details);
    // if (!query['symbol']) {
    //   values = values.forEach((item: Crypto) => {
    //     console.log('item', item)
    //     console.log('query["symbol"]', query['symbol'])
    //     return item.symbol === query['symbol'];
    //   });
    // }

    res.status(200).json(crypto_details);
   });

  //  app.get("/messages/:idx_date", (req, res) => {
  //     const messageId = req.params.id;
  //     const messageOpt = messagesStorage.get(messageId);
  //     if ("None" in messageOpt) {
  //        res.status(404).send(`the message with id=${messageId} not found`);
  //     } else {
  //        res.json(messageOpt.Some);
  //     }
  //  });

  //  app.put("/messages/:id", (req, res) => {
  //     const messageId = req.params.id;
  //     const messageOpt = messagesStorage.get(messageId);
  //     if ("None" in messageOpt) {
  //        res.status(400).send(`couldn't update a message with id=${messageId}. message not found`);
  //     } else {
  //        const message = messageOpt.Some;
  //        const updatedMessage = { ...message, ...req.body, updatedAt: getCurrentDate()};
  //        messagesStorage.insert(message.id, updatedMessage);
  //        res.json(updatedMessage);
  //     }
  //  });

  //  app.delete("/messages/:id", (req, res) => {
  //     const messageId = req.params.id;
  //     const deletedMessage = messagesStorage.remove(messageId);
  //     if ("None" in deletedMessage) {
  //        res.status(400).send(`couldn't delete a message with id=${messageId}. message not found`);
  //     } else {
  //        res.json(deletedMessage.Some);
  //     }
  //  });

   return app.listen();
});

function getCurrentDate() {
   const timestamp = new Number(ic.time());
   return new Date(timestamp.valueOf() / 1000_000);
}