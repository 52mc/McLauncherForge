import { Promise, coroutine as co} from 'bluebird';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import mkdirp from 'mkdirp';

var IO = {};

IO.request = function(url, timeout) {
  return fetch(url, {
    timeout: timeout
  }).then((res) => {
    return Promise.resolve(res.text());
  });
}

IO.createFolder = function(dir) {
  return new Promise((resolve, reject) => {
    if(!fs.existsSync(dir)) {
      mkdirp(dir, (err) => {
        err ? reject(err) : resolve();
      });
    } else {
      resolve();
    }
  });
}

IO.writeFile = function(fileName, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, content, 'utf8', (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
}

IO.createFolderAndWriteFile = function(fileName, content) {
  return this.createFolder(path.dirname(fileName)).then(() => {
    return this.writeFile(fileName, content);
  });
}

module.exports = IO;
