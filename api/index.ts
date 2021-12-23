import cors from 'cors';
import mongoose from 'mongoose';
import express, { Application } from 'express';

const app: Application = express();

const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }))

import creatureRouter from './routes/creatures';
import creatureTypeRouter from './routes/creatureTypes';
import umrRouter from './routes/universal_monster_rules';

const db = 'mongodb://127.0.0.1:27017/strange_aeons';
const connect = () => {
    mongoose
      .connect(
        db,
        { useUnifiedTopology: true, useNewUrlParser: true }
      )
      .then(() => {
        return console.info(`Successfully connected to ${db}`);
      })
      .catch(error => {
        console.error('Error connecting to database: ', error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);

app.use('/creatures', creatureRouter);
app.use('/umrs', umrRouter);
app.use('/creature_types', creatureTypeRouter);

app.listen(PORT, () =>
    console.log(`Server is running on Port: ${ PORT }`)
);