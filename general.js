class GeneralService {

    constructor() { }
  
    capitalizeWord(str) {
      return str.substring(0, 1).toUpperCase().concat(str.substr(1));
    }
  
    capitalizeDashedWord(str) {
      return str.split('-').map(s => s.substring(0, 1).toUpperCase().concat(s.substr(1))).join('-');
    }
  
    getCamelCasedWordFromPhrase(str) {
      const parts = str.split(' ');
      const firstWord = parts[0].toLowerCase();
      parts.splice(0, 1);
      return firstWord.concat(parts.map(w => this.capitalizeWord(w)).join(''));
    }
  
    stripTags(html, exclude) {
      exclude.forEach(exc => {
        exc = exc.replace(/\s/g, '\\\s');
        const r1 = new RegExp(
          exc.length === 1 ?
            `[<][${exc}][>]` :
            `[<]${exc}[>]`
        );
        const r2 = new RegExp(
          exc.length === 1 ?
            `[<][\/][${exc}][>]` :
            `[<][\/][${exc.substr(0, 1)}][>]`
        );
        for (; r1.test(html);) {
          html = exc.length === 1 ?
            html.replace(r1, `||${exc}||`) :
            html.replace(r1, `||u style="color: rgb(102, 102, 102);"||`);
        }
        for (; r2.test(html);) {
          html = exc.length === 1 ?
            html = html.replace(r2, `__${exc}||`) :
            html = html.replace(r2, exc.substr(0, 1));
        }
      });
      let tmp = document.createElement('DIV');
      tmp.innerHTML = html;
      html = tmp.textContent || tmp.innerText;
      tmp = null;
      exclude.forEach(exc => {
        exc = exc.replace(/\s/g, '\\\s');
        const r1 = new RegExp(
          exc.length === 1 ?
            `[|][|][${exc}][|][|]` :
            `[|][|]${exc}[|][|]`
        );
        const r2 = new RegExp(
          exc.length === 1 ?
            `[_][_][${exc}][|][|]` :
            `[_][_][${exc.substr(0, 1)}][|][|]`
        );
        for (; r1.test(html);) {
          html = exc.length === 1 ?
            html.replace(r1, `<${exc}>`) :
            html.replace(r1, `<u style="color: rgb(102, 102, 102);">`)
        }
        for (; r2.test(html);) {
          html = exc.length === 1 ?
            html.replace(r2, `</${exc}>`) :
            html.replace(r2, `</${exc.substr(0, 1)}>`);
        }
        html = exc.length === 1 ?
          html.replace(r1, `<${exc}>`) :
          html.replace(r1, `<u style="color: rgb(102, 102, 102);">`);
        html = exc.length === 1 ?
          html.replace(r2, `</${exc}>`) :
          html.replace(r2, `</${exc.substr(0, 1)}>`);
      });
      return html;
    }
  
    deepClone(obj) {
      let visitedNodes = [];
      let clonedCopy = [];
      function clone(item) {
        if (typeof item === "object" && !Array.isArray(item)) {
          if (visitedNodes.indexOf(item) === -1) {
            visitedNodes.push(item);
            let cloneObject = {};
            clonedCopy.push(cloneObject);
            for (let i in item) {
              if (item.hasOwnProperty(i)) {
                cloneObject[i] = clone(item[i]);
              }
            }
            return cloneObject;
          } else {
            return clonedCopy[visitedNodes.indexOf(item)];
          }
        }
        else if (typeof item === "object" && Array.isArray(item)) {
          if (visitedNodes.indexOf(item) === -1) {
            let cloneArray = [];
            visitedNodes.push(item);
            clonedCopy.push(cloneArray);
            for (let j = 0; j < item.length; j++) {
              cloneArray.push(clone(item[j]));
            }
            return cloneArray;
          } else {
            return clonedCopy[visitedNodes.indexOf(item)];
          }
        }
  
        return item;
      }
      return clone(obj);
    }
  
    async getPromisifiedValue(val) {
      const evaluated = await val;
      return evaluated;
    }
  
    Uint8ToBase64 = (u8Arr) => {
      const CHUNK_SIZE = 0x8000; //arbitrary number
      let index = 0;
      const length = u8Arr.length;
      let result = '';
      let slice;
      while (index < length) {
        slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
        result += String.fromCharCode.apply(null, slice);
        index += CHUNK_SIZE;
      }
      return btoa(result);
    }
  
    fetchAndGetB64 = async (uri) => {
      const elemContent = await fetch(uri);
      const reader = await elemContent.body.getReader();
      const contentType = elemContent.headers.get('content-type')
  
      let arr = []
      let chunks = await reader.read();
      // const decoder = new TextDecoder('utf8');
      let continueFlag = true;
  
      arr = Array.from(chunks.value)
  
      for (; continueFlag;) {
        chunks = await reader.read();
        if (chunks.value) {
          arr = arr.concat(Array.from(chunks.value))
        } else {
          continueFlag = false;
        }
      }
  
      const uIntArr = new Uint8Array(arr);
  
      const b64 = this.Uint8ToBase64(uIntArr);
  
      return Promise.resolve(`data:${contentType};base64,${b64}`);
    }
  
    isJson(str) {
      return (/^[\],:{}\s]*$/.test(str.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, '')))
        ? true : false;
    }
  
    promiseTimeout = (t) => new Promise((resolve, reject) => setTimeout(() => {
      resolve(t);
    }, t));
  
    getGen = async function* (val, timeout) {
      let i = 0;
      while (i < val) {
        if(timeout) {
          await this.promiseTimeout(timeout);
        }
        yield i++;
      }
    }
  }
  
  module.exports = {
      GeneralService
  }