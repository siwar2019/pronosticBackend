import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();
async function mail(to: string, subject: string, html: string) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    transporter.sendMail(
      {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        html: html,
      },
      (error) => {
        if (error) {
          console.log(error);
          return reject({ message: `An error has occured` });
        }
        return resolve({ message: "Email send succesfuly" });
      }
    );
  });
}

export default mail;
