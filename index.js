const {
  Worker
} = require('worker_threads');

const WorkerModule = require('./worker.module');
const { GeneralService } = require('./general');

class AsyncWorkerStateMessage {
  worker = null;
  general = null;

  /**
* Initialize an AsyncWorker Instance.
* @param {string} [workerpath] Optional path for a web-worker. Kindly use provided worker as reference.
* @param {function} [onready] Callback to execute after worker is ready.
* @param {string} pathPrefix path prefix to specify where the file must be stored
* @returns {any} Returns a promise to handle or an error.
*/
  constructor(workerpath, onready) {
    this.worker = new Worker(workerpath || './worker.js');
    if (onready) this.init(onready);
    this.general = new GeneralService();
  }

  _init = () => {
    onready();
  }

  /**
* Set one of the props of the state in within the worker.
* @param {string} key Key.
* @param {any} value Value.
* @returns {any} Returns the value stored at "Key" in the state.
*/
  setProp = async (key, value) => {
    let toRet = null;
    this.worker.on('message', (ev) => {
      const {
        topic,
        message: {
          key,
          value
        }
      } = ev;
      toRet = value;
    })
    this.worker.postMessage({
      topic: 'set',
      message: {
        key,
        value
      }
    });
    for await (let i of this.general.getGen(100, 6)) {
      if (toRet) {
        this.worker.on('message', (ev) => { });
        break;
      }
    }
    return toRet;
  }

  /**
* Get one of the props of the Prop within the worker at "Key".
* @param {string} key Key.
* @returns {any} Returns the value stored at "Key" in the state.
*/
  getProp = async (key) => {
    let toRet = null;
    this.worker.on('message', (ev) => {
      const {
        topic,
        message: {
          key,
          value
        }
      } = ev;
      toRet = value;
    })
    this.worker.postMessage({
      topic: 'get',
      message: {
        key
      }
    });
    for await (let i of this.general.getGen(100, 6)) {
      if (toRet) {
        this.worker.on('message', (ev) => { });
        break;
      }
    }
    return toRet;
  }

  getState = async () => {
    let toRet = null;
    this.worker.on('message', (ev) => {
      const {
        topic,
        message: {
          value
        }
      } = ev;
      toRet = value;
    })
    this.worker.postMessage({
      topic: 'state'
    });
    for await (let i of this.general.getGen(100, 6)) {
      if (toRet) {
        this.worker.on('message', (ev) => { });
        break;
      }
    }
    return toRet;
  }
}

module.exports = {
  AsyncWorkerStateMessage,
  WorkerModule
}