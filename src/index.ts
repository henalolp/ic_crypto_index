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

   app.get("/ohlc", (req, res) => {
    const symbol: any = req.query.symbol;
    console.log('symbol', symbol);

    let records = cryptoStorage.values();
    console.log('records', records)

    let values: any = [];
    if (symbol) {
      values = records.map((item: Crypto) => {
        console.log('item', item)
        if (item.symbol === symbol) {
          return {
            id: item.id,
            symbol: item.symbol,
            open: item.open,
            close: item.close,
            high: item.high,
            low: item.low,
            idx_date: item.idx_date,
            createdAt: item.createdAt
          }
        }
      });
    }

    res.status(200).json(values);
   });

   app.get("/ohlc/:id", (req, res) => {
    const id = req.params.id;
    const record = cryptoStorage.get(id).Some;
    const crypto_details = {
      id: record?.id,
      symbol: record?.symbol,
      idx_date: record?.idx_date,
    }
    console.log('crypto_details', crypto_details);
    res.status(200).json(crypto_details);
   });

   return app.listen();
});

function getCurrentDate() {
   const timestamp = new Number(ic.time());
   return new Date(timestamp.valueOf() / 1000_000);
}