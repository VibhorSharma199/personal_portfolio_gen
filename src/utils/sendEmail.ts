import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ to, subject, text }: EmailOptions) {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or another email service
    auth: {
      user: "vibhorsharma969@gmail.com", // Your email address
      pass: "Vibhu2006!", // Your email password or app password
    },
  });

  await transporter.sendMail({
    from: `"Your App Name" PortfolioGen`,
    to,
    subject,
    text,
  });
}
