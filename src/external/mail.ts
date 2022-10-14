import nodemailer from "nodemailer";
import { config } from "../config/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

export async function sendInfoAtGmail(title: string, text: string) {
  if (process.env.NODE_ENV === "production")
    await transporter.sendMail({
      from: `PickFA <${config.email.user}>`,
      to: "jhunkim0828@gmail.com",
      subject: title,
      text: text,
      html: `<b>${text}</b>`,
    });
}

export async function sendErrorAtGmail(title: string, errMessage: string) {
  if (process.env.NODE_ENV === "production")
    await transporter.sendMail({
      from: `PickFA <${config.email.user}>`,
      to: config.email.user,
      subject: `[Error]: ${title}`,
      text: errMessage,
      html: `<b>${errMessage}</b>`,
    });
}
