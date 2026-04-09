import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const url = `http://localhost:5173/verify/${token}`;

  await transporter.sendMail({
    to: email,
    subject: "Verify your account",
    html: `
      <h2>Email Verification</h2>
      <p>Click below to verify:</p>
      <a href="${url}">Verify Email</a>
    `,
  });
};