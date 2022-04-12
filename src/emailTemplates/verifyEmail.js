export default function verifyEmail(firstName, email, confirmationCode) {
  return `
  <html>
    <body>
      <div style="width: 100%; margin-left: auto, margin-right: auto; padding: 12px; font-family: Arial;">
      <div style="background-color: rgb(119, 120, 240); color: white; padding: 8px; padding-top: 48px; padding-bottom: 48px; text-align: center; font-weight: bold; font-size: 36px;">Grade My Faculty</div>
        <h3 style="color: rgb(119, 120, 240);">Hi ${firstName},</h3>
        <p>Thank you for registering in Grade My Faculty. Please click on the button to complete the verification process for ${email}</p>
        <button type="button" style="color: white; background-color: rgb(119, 120, 240); border: none; border-radius: 4px; padding: 8px;">
          <a style="text-decoration: none; color: white;" href="${process.env.SERVER_URL}/verifyemail?email=${email}&confirmationCode=${confirmationCode}">
            Verify Your Email
          </a>
        </button>
        <p>If you didn't attempt to verify your email address with Grade My Faculty, please delete this email.</p>
        <p>Cheers!</p>
        <img src="https://grademyfaculty.com/favicon.ico" style="width: 50px;" />
      </div>
    </body>
  </html>
  `;
}
