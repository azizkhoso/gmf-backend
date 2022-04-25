export default function thankyouEmail(firstName) {
  return `
  <html>
    <head>
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous"><meta name="google-site-verification" content="OBHSOz2bJypVuqhse4EbUNPh6u4nlzaqmKaLoOryaqs" />
      <style>
        body {
          font-family: 'Arial', sans-serif;
        }
        
        .banner {
          background: rgb(119, 120, 240);
          color: white;
        }
        
        .banner, .email-content {
          padding: 2em;
          overflow: hidden;
        }
        
        h1 {
          font-family: 'Questrial', sans-serif;
          font-size: 3em;
          margin: 0 0 .5em 0;
        }
        
        hr {
          margin-top: 2em;
          background: blue;
        }
        
        a {
          text-decoration: none;
        }
        
        .sig {
          font-family: 'Dancing Script', cursive;
          font-size: 3.5em;
          margin: 0;
        }
        
        .email-container {
          background: #ffffff;
        }
        
        footer {
          text-align: center;
          margin: 0;
          padding: 1em;
        }
      </style>
    </head>
    <body>
      <main>
        <div class="email-container">
          <div class="email-body">
            <div class="banner">
              <h4>Registeration Successful!</h4>
              <h1 style="text-align: center;">GRADE MY FACULTY</h1>
            </div>
            <div class="email-content">
        <div style="text-align: center;">
          <img src="https://www.grademyfaculty.com/gmail-assets/person.ico" alt="person" style="width: 50%; max-width: 250px; padding-top: 28px; padding-bottom: 28px;" />
        </div>
              <p>Hi ${firstName}!</p>
              <p>Thank you for joinging Grade My Faculty!
                With your account you have the options to save the professors, edit and add your ratings, while being anonymous!</p>
        <div style="text-align: center;">
          <button type="button" style="color: white; background-color: rgb(119, 120, 240); border: none; border-radius: 4px; padding: 8px;">
            <a style="text-decoration: none; color: white;" href="https://www.grademyfaculty.com">
              Go to Grade My Faculty
            </a>
          </button>
        </div>
            <p>
              Regards, <br>
              <b>Grade My Faculty<b>
            </p>
            </div>
          </div>
        </div>
      </main>
    </body>
  </html>
  `;
}
