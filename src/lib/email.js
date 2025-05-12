 
import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  secure: process.env.EMAIL_SERVER_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// Send booking confirmation email
export async function sendBookingConfirmation(booking, restaurant, user) {
  const { date, time, people, id } = booking;
  const { name: restaurantName } = restaurant;
  const { email, name } = user;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Booking Confirmation - ${restaurantName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #333;">Your booking is confirmed!</h2>
        <p>Hello ${name},</p>
        <p>Your reservation at <strong>${restaurantName}</strong> has been confirmed.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Booking Details:</strong></p>
          <p>Date: ${formattedDate}</p>
          <p>Time: ${time}</p>
          <p>Number of People: ${people}</p>
          <p>Booking ID: ${id}</p>
        </div>
        <p>If you need to make any changes or cancel your reservation, please log in to your account or contact the restaurant directly.</p>
        <p>Thank you for choosing CityEats!</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// Send registration confirmation email
export async function sendRegistrationConfirmation(user) {
  const { email, name } = user;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to CityEats!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #333;">Welcome to CityEats!</h2>
        <p>Hello ${name},</p>
        <p>Thank you for registering with CityEats. We're excited to have you on board!</p>
        <p>You can now:</p>
        <ul>
          <li>Explore restaurants in your city</li>
          <li>Book tables at your favorite places</li>
          <li>Pre-order food for your visit</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <p>Happy dining!</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// Send vendor application notification to admin
export async function sendVendorApplicationNotification(vendor, user) {
  const { storeName } = vendor;
  const { name, email } = user;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Restaurant Registration',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #333;">New Restaurant Registration</h2>
        <p>A new vendor has registered on CityEats:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Restaurant Name:</strong> ${storeName}</p>
          <p><strong>Owner Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
        <p>Please review this application in the admin dashboard.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export default {
  sendBookingConfirmation,
  sendRegistrationConfirmation,
  sendVendorApplicationNotification
};