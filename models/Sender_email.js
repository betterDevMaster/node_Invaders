// mail model....

var Mailer = function() {
	this.nodemailer = require('nodemailer');
	this.smtpConfig = {
		// host: 'localhost',
		port: 1025,
		// secure: false, // use SSL
		// auth: {
		// 	user: 'user@gmail.com',
		// 	pass: 'pass'
		// }
		tls: {rejectUnauthorized: false}
	}
	this.transporter;
	this.mailOptions = {
		from: '"Invaders" <contact@adam-parent.com>', // sender address
		to: '', // list of receivers
		subject: '', // Subject line
		text: '', // plaintext body
		html: '' // html body
	};
};
Mailer.prototype.sendNodemailer = function(typeSend, to, subject, html) {
	if(typeSend === 'smtp'){

		this.transporter = this.nodemailer.createTransport(this.smtpConfig);
		
		this.mailOptions.to = to;
		this.mailOptions.subject = subject;
		this.mailOptions.html = html;
		
		this.transporter.sendMail(this.mailOptions, function(error, info){
			if(error){
				return console.log(error);
			}
			console.log('message sent : ' + info.response);
		});

		this.transporter.close();
		
	}
};
module.exports = new Mailer();