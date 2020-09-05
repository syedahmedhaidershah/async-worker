let state = {};

addEventListener('message', ({ data }) => {
  const {
    topic,
    message: {
      key,
      value
    }
  } = data;

  switch (topic) {
    case 'set':
      state[key] = value;
      postMessage({
        topic: 'key-set',
        message: key
      });
      break;
    case 'get':
      postMessage({
        topic: 'get-key',
        message: {
          key,
          value: state[key]
        }
      });
    default:
      break;
  }
});
