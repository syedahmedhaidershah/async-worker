let state = {};

addEventListener('message', ({ data }) => {
  const {
    topic,
    message
  } = data;

  let key, value;

  if(message) {
    key = message.key;
    value = message.value;
  }

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
      break;
    case 'state':
      postMessage({
        topic: 'get-state',
        message: {
          key,
          value: state
        }
      })
      break;
    default:
      break;
  }
});
