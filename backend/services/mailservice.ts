import * as dotenv from "dotenv";
import * as nodemailer from "nodemailer";

dotenv.config();

async function mailService(to: string, subject: string, text: string): Promise<void> {
  console.log("mail services called");
  console.log(process.env.MAILTRAP_HOST);
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  } as any);

  const mailOptions = {
    from: process.env.MAILTRAP_SENDEREMAIL,
    to,
    subject,
    text,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("mail sent successfully");
  } catch (error) {
    console.log("unable to send mail");
  }
}

export default mailService;
