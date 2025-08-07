const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Function to convert image to base64
const getBase64Image = (imagePath) => {
    try {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (!fs.existsSync(fullPath)) {
            console.warn(`Image not found at path: ${fullPath}`);
            return null;
        }
        const imageBuffer = fs.readFileSync(fullPath);
        return `data:image/png;base64,${imageBuffer.toString('base64')}`;
    } catch (error) {
        console.error('Error reading image:', error);
        return null;
    }
};

// Create reusable transporter object using Gmail SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL, // Your Gmail address
        pass: process.env.ADMIN_EMAIL_PASS // Your Gmail app password
    }
});

// Email template for contact form submissions
const createEmailContent = (formData) => {
    // Get base64 encoded images
    const logoBase64 = getBase64Image('public/images/fazads/logo.png');
    const homeBgBase64 = getBase64Image('public/images/fazads/home-bg.png');

    // Define styles
    const styles = {
        header: homeBgBase64 
            ? `background-image: url('${homeBgBase64}'); background-size: cover; background-position: center;`
            : 'background-color: #2d5a87;',
        content: homeBgBase64
            ? `background-image: url('${homeBgBase64}'); background-size: cover; background-position: center; background-color: rgba(249, 249, 249, 0.9); background-blend-mode: overlay;`
            : 'background-color: #f9f9f9;',
        logo: logoBase64 
            ? `<img src="${logoBase64}" alt="Cybex Construction" style="max-width: 150px; margin-bottom: 20px;">`
            : ''
    };

    return {
        subject: 'New Lead Form Web Form Submission - Cybex Construction',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 0; background-color: #fff;">
                    <!-- Header with Background Image -->
                    <div style="${styles.header} color: white; padding: 40px 20px; text-align: center; position: relative;">
                        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5);"></div>
                        <div style="position: relative; z-index: 1;">
                            ${styles.logo}
                            <h1 style="margin: 0; color: white; font-size: 24px;">New Contact Form Submission</h1>
                        </div>
                    </div>
                    
                    <!-- Content Section -->
                    <div style="padding: 20px; ${styles.content};">
                        <!-- Customer Information -->
                        <div style="margin-bottom: 20px; padding: 20px; background-color: rgba(255, 255, 255, 0.95); border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <h2 style="color: #2d5a87; border-bottom: 2px solid #2d5a87; padding-bottom: 10px; margin-bottom: 20px;">Customer Information</h2>
                            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                                <tr>
                                    <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; background-color: rgba(245, 245, 245, 0.9);">Name</th>
                                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${formData.firstName} ${formData.lastName}</td>
                                </tr>
                                <tr>
                                    <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; background-color: rgba(245, 245, 245, 0.9);">Email</th>
                                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${formData.email}</td>
                                </tr>
                                <tr>
                                    <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; background-color: rgba(245, 245, 245, 0.9);">Phone</th>
                                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${formData.phone}</td>
                                </tr>
                                <tr>
                                    <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; background-color: rgba(245, 245, 245, 0.9);">Location</th>
                                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${formData.location}</td>
                                </tr>
                                <tr>
                                    <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; background-color: rgba(245, 245, 245, 0.9);">Land Ownership</th>
                                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${formData.ownLand}</td>
                                </tr>
                            </table>
                        </div>

                        <!-- Additional Information -->
                        <div style="margin-bottom: 20px; padding: 20px; background-color: rgba(255, 255, 255, 0.95); border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <h2 style="color: #2d5a87; border-bottom: 2px solid #2d5a87; padding-bottom: 10px; margin-bottom: 20px;">Additional Information</h2>
                            <p style="margin: 0;">${formData.additionalInfo || 'None provided'}</p>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="text-align: center; padding: 20px; font-size: 12px; background-color: #2d5a87; color: white;">
                        <p style="margin: 0;">This email was sent from the Cybex Construction website contact form.</p>
                        <p style="margin: 10px 0 0 0;">© 2025 Cybex Construction. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
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