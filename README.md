# Async Worker

[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=102)](https://opensource.org/licenses/MIT)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/xsahil03x/fancy_on_boarding/blob/master/LICENSE)

An easy way to send async messages to a web-worker.

### Pros

This converts the Service-Worker / Worker's method **postMessage** to an async blocking call.
The best part is there is no overhead on CPU or memory usage.

### Installation

Install in your nodejs package and start using right away. you could provide a custom **worker** or follow the **worker** boilerplate used by us.

```js
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

```

A sample usage of this **Async Worker**  as follows:

```js

const aw = require('async-worker');

const awInstance = aw();
// You could pass a custom worker path in here.
// const awInstance = aw(<YOUR_WORKER's_PATH>);

// this is an anonymous function or IIFE that will set a key and retreive it to the worker's state using a key-value pair.
(async () => {
    const stored = await aw.setState('test',456);
    const retreived = await aw.getState('test');
    console.log(retreived); // This will log 456
})();

```

#### Support
We have not released an ES6 module yet. We could use your support to release packages for ES6 Browser modules, Angular, React and definitions with better documentation.

Our IBAN is PK56 HABB 0050237000223103.
Bank: HBL Pakistan.
Title: Syed Ahmed Haider