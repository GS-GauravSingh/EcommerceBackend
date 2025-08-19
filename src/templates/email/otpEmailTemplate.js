/**
 * OTP Email Template
 * @param {string} otp - The OTP code
 * @param {number} expiryMinutes - Expiry time in minutes
 * @param {string} username - Recipient name (optional)
 * @returns {string} - Formatted OTP HTML email
 */
const generateOtpEmailTemplate = (
	otp,
	expiryMinutes = 2,
	username = "User"
) => {
	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>OTP Verification</title>
	</head>
	<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f5f6fa;">

        <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f5f6fa">
            <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="20" bgcolor="#ffffff" style="margin:20px auto; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1)">
                <tr>
                    <td align="center" style="background-color:#4f46e5; border-radius:8px 8px 0 0; color:#ffffff; padding:20px; font-size:24px; font-weight:bold;">
                    Your Company Name
                    </td>
                </tr>
                <tr>
                    <td style="font-size:16px; color:#333333;">
                    <p>Hi <strong>${username}</strong>,</p>
                    <p>We received a request to verify your identity. Please use the One-Time Password (OTP) below to proceed:</p>
                    <p style="text-align:center; margin:30px 0;">
                        <span style="display:inline-block; padding:15px 30px; font-size:24px; font-weight:bold; color:#ffffff; background-color:#4f46e5; border-radius:6px; letter-spacing:3px;">
                        ${otp}
                        </span>
                    </p>
                    <p>This OTP will expire in <strong>${expiryMinutes} minutes</strong>. Do not share it with anyone.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <p style="margin-top:30px;">Thanks,<br/>The Your Company Team</p>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="font-size:12px; color:#888888; padding-top:20px; border-top:1px solid #eeeeee;">
                    © 2025 Your Company. All rights reserved.<br/>
                    This is an automated email, please do not reply.
                    </td>
                </tr>
                </table>
            </td>
            </tr>
        </table>

	</body>
	</html>
	`;
};

module.exports = { generateOtpEmailTemplate };
