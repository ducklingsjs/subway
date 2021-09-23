const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '1271384',
  key: '842243d7ff9c0da44696',
  secret: 'd1aba6c897095e8f9b73',
  cluster: 'eu',
  useTLS: true,
});

pusher.trigger('my-channel', 'my-event', {
  message: 'hello world',
});
