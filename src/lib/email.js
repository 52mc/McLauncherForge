import { Promise } from 'bluebird';
var nodemailer = require('nodemailer');
import { template } from 'lodash';
import moment from 'moment';
import config from '../config';

var transporter = nodemailer.createTransport(config.email);

const tpl = `
<style>
.e *{
	box-sizing: border-box;
}
.e{
	display: inline-block;
	width: 100%;
	height: 100%;
	background: #F0F0F0;
}

.e-header{
	width: 100%;
	height: 50px;
	line-height: 50px;
	background: #3C2F3D;
	color: #2EAC6D;
	padding: 0 20px;
	font-weight: 700;
}

.e-content{
	width: 100%;
	height: 100%;
	padding: 30px 25px;
}

.e-wrapper{
	font-size: 0.9rem;
}

.e-stack{
	font-size: 0.8rem;
	margin-top: 0;
	border-color: #eee;
	border-top-right-radius: 0;
	border-top-left-radius: 0;
}
.e-stack code{
	font-family: Monaco,Menlo,Consolas,"Courier New",FontAwesome,monospace;
	padding: 0;
  font-size: inherit;
  color: inherit;
  white-space: pre-wrap;
  background-color: transparent;
  border-radius: 0;
}

</style>
<div class="e">
	<div class="e-header">
		你的Forge解析任务失败了
	</div>
	<div class="e-content">
		<div class="e-wrapper">
			非常抱歉的通知你，你的Forge解析任务在${moment().format('YYYY-MM-DD HH:mm:ss')}工作时出现异常，请检查！💣💣💣
			<p>以下是异常的详细信息。</p>
			<pre class="e-stack">
				<code><%= stack %></code>
			</pre>
		</div>
	</div>
</div>
`;

module.exports = {
	send: (stack) => {
		const mailOptions = {
	    from: '"Github Task 👥" <admin@gmail.com>', // sender address
	    to: config.to, // list of receivers
	    subject: '你的Forge解析任务失败了 🚨', // Subject line
	    html: template(tpl)({
				stack: stack
			})
		};
		return new Promise((resolve, reject) => {
			// send mail with defined transport object
			transporter.sendMail(mailOptions, function(error, info){
				if(error){ return reject(error); }
				resolve(`Message sent: ${info.response}`);
			});
		});
	}
}
