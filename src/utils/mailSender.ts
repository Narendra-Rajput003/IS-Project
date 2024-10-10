import nodemailer from 'nodemailer';



export const sendEmail = async (email:string,title:string,body:any ) => {
    try {

        const transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
        });
    
        const message = {
            from: `Innobyte Services `,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        };
    
        await transporter.sendMail(message);
        
    } catch (error) {

        console.log(error);
        
        
    }
};