const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter object using Outlook SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.office365.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.ADMIN_EMAIL, // Admin's email address
        pass: process.env.ADMIN_EMAIL_PASS // Admin's email password
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    }
});

// Email template for contact form submissions
const createEmailContent = (formData) => {
    return {
        subject: 'New Lead Form Web Form Submission - Cybex Construction',
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
            <p><strong>Location:</strong> ${formData.location}</p>
            <p><strong>Land Ownership:</strong> ${formData.ownLand}</p>
            <p><strong>Additional Information:</strong></p>
            <p>${formData.additionalInfo || 'None provided'}</p>
        `
    };
};

// Function to send email
const sendEmail = async (formData) => {
    try {
        const emailContent = createEmailContent(formData);
        
        const mailOptions = {
            from: {
                name: 'Cybex Construction Admin',
                address: process.env.ADMIN_EMAIL
            },
            to: process.env.CEO_EMAIL, // CEO's email address
            replyTo: formData.email, // Allow CEO to reply directly to the customer
            subject: emailContent.subject,
            html: emailContent.html
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail }; 