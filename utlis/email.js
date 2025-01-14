const nodemailer = require("nodemailer");
const dotenv=require("dotenv")
dotenv.config()


const transporter = nodemailer.createTransport({
    service:process.env.HostService,
    auth: {
        user: process.env.HostEmail,
        pass: process.env.HostPassword,
    },
});

async function Sendmail(email, htmltemplate) {

    const info = await transporter.sendMail({
        from:process.env.HostEmail,
        to: email,
        subject: "Verification E-mail",
        html: htmltemplate,
    });

    console.log("otp send successfully");
}


module.exports = Sendmail