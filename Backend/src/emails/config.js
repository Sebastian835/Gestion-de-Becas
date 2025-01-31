import dotenv from 'dotenv';
dotenv.config();

export const mailConfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  
  }
};