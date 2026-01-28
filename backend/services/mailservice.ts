import * as dotenv from "dotenv";
import * as nodemailer from "nodemailer";

dotenv.config();

async function mailService(to: string, subject: string, html: string): Promise<void> {
  console.log("mail services called");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  } as any);

  const mailOptions = {
    from: `"Reflectify" <${process.env.SMTP_FROM}>`,
    to,
    subject,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("mail sent successfully");
  } catch (error) {
    console.log("unable to send mail");
  }
}

export default mailService;
