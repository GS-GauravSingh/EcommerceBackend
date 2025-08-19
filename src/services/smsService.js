const twilio = require("twilio");
const { env } = require("../config/environmentVariables");

// Initialize Twilio Client
const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

/**
 * sendSMS(): Generic helper function to send SMS via Twilio
 * @param {string} phoneNumber - The recipient's phone number (with country code, e.g., +91XXXXXXXXXX)
 * @param {string} message - The SMS body text
 * @returns {object} - Message response from Twilio
 */

async function sendSMS({ recipientPhoneNumber, messageTemplate }) {
	try {
		const response = await client.messages.create({
			body: messageTemplate,
			to: recipientPhoneNumber,
			from: env.TWILIO_PHONE_NUMBER,
		});
		console.log(`SMS sent to ${recipientPhoneNumber}:`, response);
	} catch (error) {
		console.error("smsService.js: sendSMS(): Error: ", error);
		throw error;
	}
}

module.exports = { sendSMS };
