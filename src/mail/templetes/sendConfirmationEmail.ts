const sendConfirmationEmail = (otp, url) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                background-color: #f9f9f9;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 30px auto;
                padding: 20px;
                background-color: #ffffff;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
    
            .logo {
                max-width: 150px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 20px;
                font-weight: bold;
                color: #0056b3;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
                text-align: left;
            }
    
            .highlight-box {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
            }
    
            .highlight {
                font-weight: bold;
                font-size: 24px;
                color: #d9534f;
                display: block;
                margin: 20px auto;
                padding: 20px;
                background-color: #f8f9fa;
                border: 2px solid #d9534f;
                border-radius: 10px;
                text-align: center;
                width: 60%;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
    
            .cta {
                display: inline-block;
                padding: 12px 24px;
                background-color: #5bc0de;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 18px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #777777;
                margin-top: 20px;
            }
    
            .support a {
                color: #5bc0de;
                text-decoration: none;
            }
    
            .footer {
                font-size: 12px;
                color: #aaaaaa;
                margin-top: 30px;
                text-align: center; /* Center align text */
            }
    
            .footer a {
                color: #5bc0de;
                text-decoration: none;
            }
    
            .url {
                font-size: 16px;
                margin-top: 20px;
                text-align: center;
                color: #0056b3;
            }
    
            @media only screen and (max-width: 600px) {
                .container {
                    width: 100%;
                    padding: 10px;
                }
                .cta {
                    width: 100%;
                    padding: 10px;
                }
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <a href="https://www.innobyteservices.com/"><img class="logo" src="https://www.innobyteservices.com/assets/images/transparentLogo.png" alt="Innobyte Services Logo"></a>
            <div class="message">OTP Verification Email</div>
            <div class="body">
                <p>Dear User,</p>
                <p>Thank you for registering with Innobyte Services. To complete your registration, please use the following OTP (One-Time Password) to verify your account:</p>
                <div class="highlight-box">
                    <h2 class="highlight">${otp}</h2>
                </div>
                <p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email. Once your account is verified, you will have access to our platform and its features.</p>
            </div>
            <div class="support">
                If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:info@innobyte-services.com">info@innobyte-services.com</a>. We are here to help!
            </div>
            <div class="footer">
                <p>Innobyte Services, 123 Business St, Tech City</p>
                <p><a href="#">Unsubscribe</a></p>
                <p><a href="${url}" class="url">Click here to verify your email</a></p>
            </div>
        </div>
    </body>
    
    </html>`;
  };

  export default sendConfirmationEmail;
