export default function thankyouEmail(firstName) {
  return `
  <html>
    <head>
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous"><meta name="google-site-verification" content="OBHSOz2bJypVuqhse4EbUNPh6u4nlzaqmKaLoOryaqs" />
      <style>
        @import url('https://fonts.googleapis.com/css?family=Dancing+Script|Open+Sans|Questrial&display=swap');  
        body {
          font-family: 'Open Sans', sans-serif;
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
              <h1>We Feel <span>the Love</span></h1>
            </div>
            <div class="email-content">
              <p>Hi ${firstName}!</p>
              <p>Thank you for joinging Grade My Faculty!
                With your account you have the options to save the professors, edit and add your ratings, while being anonymous!
                We're so excited to share the latest news and updates about our product with you. If you'd like to learn more, follow us on social media!</p>
              <a href="https://www.facebook.com/grademyfaculty/"><i class="fab fa-facebook-square"></i> Check us out on Facebook</a><br>
              <a href="https://www.instagram.com/grademyfaculty/"><i class="fab fa-instagram"></i> Follow Us on Instagram</a>
            <hr>
            <p>Sincerely,</p>
            <img src="https://grademyfaculty.com/favicon.ico" style="width: 50px;" />
            </div>
          </div>
        </div>
      </main>
    </body>
  </html>
  `;
}
