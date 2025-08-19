const nodemailer = require("nodemailer");
const { env } = require("../config/environmentVariables");

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: env.NODEMAILER_USERNAME,
		pass: env.NODEMAILER_PASSWORD,
	},
});

async function sendMail({
	recipientEmail,
	subject,
	textMessage,
	htmlTemplate,
}) {
	try {
		await transporter.sendMail({
			from: env.NODEMAILER_USERNAME,
			to: recipientEmail,
			subject: subject,
			text: textMessage,
			html: htmlTemplate,
		});

		console.log(
			"emailService.js: sendMail(): OTP email sent successfully!"
		);
		return true;
	} catch (error) {
		console.error(
			"emailService.js: sendMail(): Error sending OTP email:",
			error
		);
		throw error;
	}
}

module.exports = { sendMail };
