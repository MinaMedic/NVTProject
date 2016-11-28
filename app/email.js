var nodemailer = require('nodemailer');
var User = require('../app/model/user').model;

var transporter = nodemailer.createTransport('smtps://kmj.it.girls%40gmail.com:kacaminajovana@smtp.gmail.com');

var mailSender = new Object();


mailSender.sendMail = function(application, event){	
	var send_to = '';

	var users_num = 0;
	for (var i = 0; i < application.users.length; i++){
		 User.findOne({"_id":application.users[i]},function (err, entry) {
			if(err) return next(err);
			send_to += entry.email + ",";

			users_num += 1; //ovo mora ovako zato sto je send mail asihrona funkcija
			if (users_num == application.users.length) {
				 User.findOne({"_id":application.owner},function (err, entry) {
					if(err) return next(err);
					send_to += entry.email;

					sendEmails(send_to, application.name, event);
				});
			}
		});
	}
};



function sendEmails(send_to, app_name, event) {
	
	var mail_text = "An error has just happend in application " + app_name + ".\n";

    if (event.version != "")
        mail_text +=  " Version: " 
		+ event.version + ".\n";

    if (event.fragment != "")
        mail_text +=  " Fragment: " 
		+ event.fragment + ".\n";

    if (event.info != "")
        mail_text +=  " Additional info: " 
		+ event.info + ".\n";
        
    mail_text += "\n" + event.exception;

	
	var recipients = send_to.split(",");	
	recipients.forEach(function (email_to, i , array) {
		
		var mailOptions = {
			from: 'KMJ Inovations', 
			to: email_to, 
			subject: 'Error',
			text: mail_text 
		};
		
		transporter.sendMail(mailOptions, function(error, info){
			if(error){
				return console.log('Error sendng to ' + email_to);
				//return console.log(error);
			}
			console.log('Email successfully sent to ' + email_to);
		});
	});
}


module.exports = mailSender;
