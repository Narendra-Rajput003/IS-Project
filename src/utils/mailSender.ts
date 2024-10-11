import nodemailer from 'nodemailer';

export const sendEmail = async (email: string, title: string, body: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465, // Secure SMTP
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const message = {
      from: '"Innobyte Services" <no-reply@innobyteservices.com>', // Set a valid from email address
      to: email, // recipient's email
      subject: title, // email subject
      html: body, // HTML content
    };

    // Send email
    await transporter.sendMail(message);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    // You can throw the error again if you want to handle it further up the call stack
  }
};
