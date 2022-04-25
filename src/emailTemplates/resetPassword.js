export default function resetPassword(confirmationCode, isFirstAttempt) {
  return `
  <html>
    <head>
      <title>Reset Passowrd</title>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
      <meta content="width=device-width" name="viewport">
      <style type="text/css">
        @font-face {
          font-family: &#x27;
          Postmates Std&#x27;
          ;
          font-weight: 600;
          font-style: normal;
          src: local(&#x27; Postmates Std Bold&#x27; ), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-bold.woff) format(&#x27; woff&#x27; );
        }

        @font-face {
          font-family: &#x27;
          Postmates Std&#x27;
          ;
          font-weight: 500;
          font-style: normal;
          src: local(&#x27; Postmates Std Medium&#x27; ), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-medium.woff) format(&#x27; woff&#x27; );
        }

        @font-face {
          font-family: &#x27;
          Postmates Std&#x27;
          ;
          font-weight: 400;
          font-style: normal;
          src: local(&#x27; Postmates Std Regular&#x27; ), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-regular.woff) format(&#x27; woff&#x27; );
        }
      </style>
      <style media="screen and (max-width: 680px)">
        @media screen and (max-width: 680px) {
          .page-center {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }

          .footer-center {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
      </style>
    </head>

    <body style="background-color: #f4f4f5;">
      <table cellpadding="0" cellspacing="0"
        style="width: 100%; height: 100%; background-color: #f4f4f5; text-align: center;">
        <tbody>
          <tr>
            <td style="text-align: center;">
              <table align="center" cellpadding="0" cellspacing="0" id="body"
                style="background-color: #fff; width: 100%; max-width: 680px; height: 100%;">
                <tbody>
                  <tr>
                    <td colspan="2" style="padding-top: 18px; padding-bottom: 18px; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: white; background-color: rgb(119, 120, 240); font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 32px; font-smoothing: always; font-style: normal; font-weight: 600; text-decoration: none;">
                      GRADE MY FACULTY
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table align="center" cellpadding="0" cellspacing="0" class="page-center"
                        style="text-align: left; padding-bottom: 88px; width: 100%; padding-left: 60px; padding-right: 60px;">
                        <tbody>
                          <tr>
                            <td style="padding-top: 24px; text-align: center;">
                              <img src="https://www.grademyfaculty.com/gmail-assets/person.ico"
                                style="width: 50%; max-width: 250px;">
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2"
                              style="padding-top: 28px; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: rgb(119, 120, 240); font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 32px; font-smoothing: always; font-style: normal; font-weight: 600; letter-spacing: -2.6px; line-height: 52px; mso-line-height-rule: exactly; text-decoration: none;">
                              Reset your password</td>
                          </tr>
                          <tr>
                            <td style="padding-top: 28px; padding-bottom: 28px;">
                              <table cellpadding="0" cellspacing="0" style="width: 100%">
                                <tbody>
                                  <tr>
                                    <td
                                      style="width: 100%; height: 1px; max-height: 1px; background-color: #d9dbe0; opacity: 0.81">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td
                              style="-ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #000; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;">
                              You're receiving this e-mail because you requested a password reset for your Grade My Faculty
                              account.
                            </td>
                          </tr>
                          <tr>
                            <td
                              style="padding-top: 24px; -ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #000; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;">
                              ${!isFirstAttempt ? 'You entered a wrong confirmation code, new code is given below.' : 'Your confirmation code is given below. This code is valid for 1 minute only.'}
                              </td>
                          </tr>
                          <tr>
                            <td style="text-align: center">
                              <div
                                style="margin-top: 36px; letter-spacing: 4px; -ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #ffffff; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 28px; font-smoothing: always; font-style: normal; font-weight: 600; letter-spacing: 4px; line-height: 48px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; min-width: 150px; background-color: #999; border-radius: 28px; display: inline-block; text-align: center; text-transform: uppercase; padding-left: 8px; padding-right: 8px">
                                ${confirmationCode}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td
                              style="padding-top: 24px; -ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #000; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;">
                              Regards, <br>
                              <b>Grade My Faculty</b>
                              </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
`;
}
