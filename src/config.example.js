module.exports = {
	// to user email
	to: 'abc@gmail.com',
	// nodemailer.createTransport options
	email : {
		host: 'smtp.gmail.com',
	  port: 465,
	  secure: true, // use SSL
	  auth: {
	      user: 'sender@gmail.com',
	      pass: 'xxx'
	  },
		proxy: 'socks5://localhost:1080/'
	}
}
