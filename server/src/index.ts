import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';

const app = express();
const server = new ApolloServer();

server.applyMiddleware({ app, path: '/api' });
const port = 9000;
import { listings } from './listings';

app.use(bodyParser.json());
// app.use(express.json()); // alternatively express provide parser
app.get('/', (_req, res) => res.send('hello world'));

app.get('/listings', (_req, res) => {
  res.send(listings);
});
app.post('/delete-listing', (req, res) => {
  const id: string = req.body.id;
  for (let i = 0; i < listings.length; i++) {
    if(listings[i].id === id) {
     return res.send(listings.splice(i, 1));
    }
  }
  return res.send('failed to delete listing');
});
app.listen(port);

console.log(`[app] : http://localhost:${port}`);