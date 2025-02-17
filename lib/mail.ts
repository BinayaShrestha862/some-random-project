// import {Resend} from "resend"
// const resend = new Resend(process.env.RESEND_API_KEY)
const htmlTemplate=(url:string)=>{
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 20px;
        color: #333;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      .email-header {
        text-align: center;
        margin-bottom: 20px;
      }
      .email-content {
        text-align: center;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-size: 16px;
        font-weight: bold;
      }
        a{
        padding: 10px 20px;
        background-color: aqua;
        color: black;


        }
      .button:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <h1 class="email-header">Hello!</h1>
      <p class="email-content">
        Thank you for choosing us! verify your account from here
      </p>
      <div class="email-content">
       <a href='${url}'>Click here to verify</a>
      </div>
    </div>
  </body>
</html>`
}
    

export const sendVerificationEmail=async(email:string,token:string)=>{
  const confirmLink=`http://localhost:3000/auth/new-verification?token=${token}`;
    const html=htmlTemplate(confirmLink)
    await sendTestEmail(email,html)
}
export const sendPasswordResetEmail=async(email:string,token:string)=>{
  const confirmLink=`http://localhost:3000/auth/new-verification?token=${token}`;
    const html=htmlTemplate(confirmLink)
    await sendTestEmail(email,html)
}


import { google } from "googleapis";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const CLIENT_ID = process.env.MAIL_CLIENT_ID; // Google client id
const CLIENT_SECRET = process.env.MAIL_CLIENT_SECRET; // Google client secret
const REFRESH_TOKEN = process.env.MAIL_RRFRESH_TOKEN; // Refresh token of OAuth2 login
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const MY_EMAIL = "binayastha37b@gmail.com"; // Your email here

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendTestEmail = async (to: string, html: string) => {
  try {
    const { token } = await oAuth2Client.getAccessToken();
    const ACCESS_TOKEN = token;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: MY_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: ACCESS_TOKEN,
      },
      tls: {
        rejectUnauthorized: true,
      },
    } as SMTPTransport.Options);

    // EMAIL OPTIONS
    const from = MY_EMAIL;
    const subject = "E-commerce";

    return new Promise((resolve, reject) => {
      transport.sendMail({ from, subject, to, html }, (err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });
  } catch (error) {
    console.error('Error in sendTestEmail:', error);
    throw error;
  }
};