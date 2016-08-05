"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}var _bluebird=require("bluebird"),_fs=require("fs"),_fs2=_interopRequireDefault(_fs),_path=require("path"),_path2=_interopRequireDefault(_path),_nodeFetch=require("node-fetch"),_nodeFetch2=_interopRequireDefault(_nodeFetch),_mkdirp=require("mkdirp"),_mkdirp2=_interopRequireDefault(_mkdirp),IO={};IO.request=function(e,t){return(0,_nodeFetch2["default"])(e,{timeout:t}).then(function(e){return _bluebird.Promise.resolve(e.text())})},IO.createFolder=function(e){return new _bluebird.Promise(function(t,r){_fs2["default"].existsSync(e)?t():(0,_mkdirp2["default"])(e,function(e){e?r(e):t()})})},IO.writeFile=function(e,t){return new _bluebird.Promise(function(r,i){_fs2["default"].writeFile(e,t,"utf8",function(e,t){e?i(e):r(t)})})},IO.createFolderAndWriteFile=function(e,t){var r=this;return this.createFolder(_path2["default"].dirname(e)).then(function(){return r.writeFile(e,t)})},module.exports=IO;