const Pusher = require('pusher');
var cors = require('cors');
const express = require('express');

const pusher = new Pusher({
  appId: '1271384',
  key: '842243d7ff9c0da44696',
  secret: 'd1aba6c897095e8f9b73',
  cluster: 'eu',
  useTLS: true,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 3000;

app.post('/', (req, res) => {
  console.log('message', req.body.message);
  pusher.trigger('my-channel', 'my-event', {
    message: req.body.message,
  });
  res.send('success!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
