"use strict";function _interopRequireDefault(n){return n&&n.__esModule?n:{"default":n}}var _bluebird=require("bluebird"),_lodash=require("lodash"),_moment=require("moment"),_moment2=_interopRequireDefault(_moment),_config=require("../config"),_config2=_interopRequireDefault(_config),nodemailer=require("nodemailer"),transporter=nodemailer.createTransport(_config2["default"].email),tpl='\n<style>\n.e *{\n\tbox-sizing: border-box;\n}\n.e{\n\tdisplay: inline-block;\n\twidth: 100%;\n\theight: 100%;\n\tbackground: #F0F0F0;\n}\n\n.e-header{\n\twidth: 100%;\n\theight: 50px;\n\tline-height: 50px;\n\tbackground: #3C2F3D;\n\tcolor: #2EAC6D;\n\tpadding: 0 20px;\n\tfont-weight: 700;\n}\n\n.e-content{\n\twidth: 100%;\n\theight: 100%;\n\tpadding: 30px 25px;\n}\n\n.e-wrapper{\n\tfont-size: 0.9rem;\n}\n\n.e-stack{\n\tfont-size: 0.8rem;\n\tmargin-top: 0;\n\tborder-color: #eee;\n\tborder-top-right-radius: 0;\n\tborder-top-left-radius: 0;\n}\n.e-stack code{\n\tfont-family: Monaco,Menlo,Consolas,"Courier New",FontAwesome,monospace;\n\tpadding: 0;\n  font-size: inherit;\n  color: inherit;\n  white-space: pre-wrap;\n  background-color: transparent;\n  border-radius: 0;\n}\n\n</style>\n<div class="e">\n\t<div class="e-header">\n\t\t你的Forge解析任务失败了\n\t</div>\n\t<div class="e-content">\n\t\t<div class="e-wrapper">\n\t\t\t非常抱歉的通知你，你的Forge解析任务在'+(0,_moment2["default"])().format("YYYY-MM-DD HH:mm:ss")+'工作时出现异常，请检查！💣💣💣\n\t\t\t<p>以下是异常的详细信息。</p>\n\t\t\t<pre class="e-stack">\n\t\t\t\t<code><%= stack %></code>\n\t\t\t</pre>\n\t\t</div>\n\t</div>\n</div>\n';module.exports={send:function(n){var e={from:'"Github Task 👥" <admin@gmail.com>',to:_config2["default"].to,subject:"你的Forge解析任务失败了 🚨",html:(0,_lodash.template)(tpl)({stack:n})};return new _bluebird.Promise(function(n,t){transporter.sendMail(e,function(e,r){return e?t(e):void n("Message sent: "+r.response)})})}};