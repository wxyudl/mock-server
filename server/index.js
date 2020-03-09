const express = require('express');
const bodyParser = require('body-parser')
const storage = require('node-persist');
const cors = require('cors');

const app = express();
const port = 3100;
const mocks_key = 'mocks';

storage.init();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', (req, res) => res.send('Hi'));

// Get all mocks
app.get('/_/mocks', async (req, res) => {
  const data = await storage.getItem(mocks_key) || [];
  return res.send(data);
});

// Get one mock by name
app.all('/mock/:name', async (req, res) => {
  const { name } = req.params;
  const data =  await storage.getItem(name) || [];

  res.setHeader('Content-Type', 'application/json');
  return res.send(data.payload);
});

// Create mock
app.put('/_/mocks', async (req, res) => {
  const data =  await storage.getItem(mocks_key) || [];
  const { method, name, note = '', payload } = req.body;
  const date = (new Date()).toISOString();

  if (!data.find(mock => mock.name === name) && name && method) {
    data.push({
      method,
      name,
      note,
      date
    });
  }
  
  // Store payload
  name && await storage.setItem(name, {
    payload
  });
  
  await storage.setItem(mocks_key, data);

  return res.send(data);
});

app.listen(port, () => console.log(`Example app listening on port ${ port }!`));