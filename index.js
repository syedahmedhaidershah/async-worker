module.exports = class AsyncWorkerStateMessage {
    worker = null

    constructor(workerpath) {
        this.worker = new Worker(workerpath || './worker.js');
        this.init();
    }

    _init = () => {
         
    }

    setState = async (key, value) => {
        let toRet = null;
        this.worker.addEventListener('message', (ev) => {
          const {
            data: {
              message: {
                key,
                value
              }
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
            if(toRet) {
              this.worker.removeEventListener('message', (ev) => {});
              break;
            }
        }
        return toRet;
      }
    
      getState = async (key) => {
        let toRet = null;
        this.worker.addEventListener('message', (ev) => {
          const {
            data: {
              message: {
                key,
                value
              }
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
            if(toRet) {
              this.worker.removeEventListener('message', (ev) => {});
              break;
            }
        }
        return toRet;
      }
}