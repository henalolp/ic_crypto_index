import { v4 as uuidv4 } from 'uuid';
import { Server, StableBTreeMap, ic } from 'azle';
import express from 'express';
import api from './api';

class User {
  id: string;
  username: string;
  password: string; // Make sure to hash this before storing
  mail: string;
  createdAt: Date;

  constructor(id: string, username: string, password: string, mail: string, createdAt: Date) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.mail = mail;
    this.createdAt = createdAt;
  }
}

class Crypto {
  id: string;
  symbol: string;
  open: number;
  close: number;
  high: number;
  low: number;
  idx_date: Date;
  createdAt: Date;

  constructor(
    id: string,
    symbol: string,
    open: number,
    close: number,
    high: number,
    low: number,
    idx_date: Date,
    createdAt: Date
  ) {
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

class ApiKey {
  id: string;
  username: string;
  createdAt: Date;
  expiresAt: Date;

  constructor(id: string, username: string, createdAt: Date, expiresAt: Date) {
    this.id = id;
    this.username = username;
    this.createdAt = createdAt;
    this.expiresAt = expiresAt;
  }
}

const CryptoStorage = StableBTreeMap<string, Crypto>(0);
const UserStorage = StableBTreeMap<string, User>(1);
const ApiKeyStorage = StableBTreeMap<string, ApiKey>(2);

const storages = { CryptoStorage, UserStorage, ApiKeyStorage };

export default Server(() => {
  const app = express();
  app.use(express.json());

  app.use('/', api(storages));

  // Helper function for response formatting
  const sendResponse = (res: express.Response, status: number, success: boolean, data?: any, error?: string) => {
    res.status(status).json({ success, data, error });
  };

  app.post("/ohlc", (req, res) => {
    const { symbol, open, close, high, low, idx_date } = req.body;

    // Validate input
    if (!symbol || typeof open !== 'number' || typeof close !== 'number' || 
        typeof high !== 'number' || typeof low !== 'number' || !idx_date) {
      return sendResponse(res, 400, false, undefined, "All fields are required and must be valid.");
    }

    const crypto = new Crypto(
      uuidv4(), 
      symbol, 
      open, 
      close, 
      high, 
      low, 
      new Date(idx_date), 
      getCurrentDate()
    );

    CryptoStorage.insert(crypto.id, crypto);
    sendResponse(res, 201, true, crypto);
  });

  app.get("/ohlc", (req, res) => {
    const symbol: string | undefined = req.query.symbol;

    let records = CryptoStorage.values();

    if (symbol) {
      records = records.filter((item: Crypto) => item.symbol === symbol);
    }

    sendResponse(res, 200, true, records);
  });

  app.get("/ohlc/by_date", (req, res) => {
    const startDateParam = req.query.startDate;
    const endDateParam = req.query.endDate;

    if (!startDateParam || !endDateParam) {
      return sendResponse(res, 400, false, undefined, "startDate and endDate are required.");
    }

    const records = CryptoStorage.values();
    const startDate = new Date(startDateParam);
    const endDate = new Date(endDateParam);

    const filtered = records.filter((item: Crypto) => {
      const idx_date = new Date(item.idx_date);
      return idx_date >= startDate && idx_date <= endDate;
    });

    sendResponse(res, 200, true, filtered);
  });

  // Optional: Implement the endpoint to get a crypto by ID
  app.get("/ohlc/:id", (req, res) => {
    const id = req.params.id;
    const record = CryptoStorage.get(id);

    if (record) {
      const crypto_details = {
        id: record.id,
        symbol: record.symbol,
        open: record.open,
        close: record.close,
        high: record.high,
        low: record.low,
        idx_date: record.idx_date,
        createdAt: record.createdAt,
      };
      sendResponse(res, 200, true, crypto_details);
    } else {
      sendResponse(res, 404, false, undefined, "Record not found.");
    }
  });

  return app.listen();
});

function getCurrentDate() {
  const timestamp = new Number(ic.time());
  return new Date(timestamp.valueOf() / 1000_000);
}
