"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function buildUrl(e){return"http://files.minecraftforge.net/"+e}function free(e){return new _bluebird.Promise(function(r,t){_log2["default"].debug("开始分析forge页面，version: "+e.version),IO.request(buildUrl(e.url),2e4).then(function(e){var r=Parser(e);return r.getForgeVersion()}).then(function(r){return IO.createFolderAndWriteFile(_path2["default"].resolve(__dirname,"../files/forge/"+e.version+".json"),JSON.stringify(r,null,"\t"))}).then(function(){return r()})["catch"](function(e){return t(e)})})}var _path=require("path"),_path2=_interopRequireDefault(_path);require("babel-polyfill");var _bluebird=require("bluebird"),_log=require("./lib/log"),_log2=_interopRequireDefault(_log),forgeUrl="http://files.minecraftforge.net/",IO=require("./lib/io"),Parser=require("./lib/parse");IO.request(forgeUrl,2e4).then(function(e){var r=Parser(e),t=r.getSupportVersion();return{parser:r,vs:t}}).then(function(e){for(var r=(e.parser.getForgeVersion(),{}),t=0;t<e.vs.length;t++)for(var n=e.vs[t],u=0;u<n.subs.length;u++){var o=n.subs[u];r[o.version]=o}return{forgeMap:r,vs:e.vs}}).then(function(e){var r=e.forgeMap,t=Reflect.ownKeys(r),n=t.length-1,u=(0,_bluebird.coroutine)(regeneratorRuntime.mark(function o(){var u,i=this;return regeneratorRuntime.wrap(function(o){for(;;)switch(o.prev=o.next){case 0:_log2["default"].debug("准备分析页面，共有"+n+"个任务."),u=regeneratorRuntime.mark(function a(){var e;return regeneratorRuntime.wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return e=r[t[n]],u.next=3,free(e).then(function(){_log2["default"].debug("forge "+e.version+".json 写入成功！")})["catch"](function(e){_log2["default"].error("分析forge页面失败。",e)})["finally"](function(){_log2["default"].debug("剩余任务数："+n--)});case 3:case"end":return u.stop()}},a,i)});case 2:if(!(n>=0)){o.next=6;break}return o.delegateYield(u(),"t0",4);case 4:o.next=2;break;case 6:return o.abrupt("return",e.vs);case 7:case"end":return o.stop()}},o,this)}));return u()}).then(function(e){return IO.createFolderAndWriteFile(_path2["default"].resolve(__dirname,"../files/versions.json"),JSON.stringify(e,null,"\t"))}).then(function(){_log2["default"].debug("versions.json write done.")})["catch"](function(e){_log2["default"].error("error",e)});