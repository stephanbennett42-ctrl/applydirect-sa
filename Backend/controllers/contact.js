const db = require('../config/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

const sendMessage = (req, res) => {
    const {
        student_id,
        full_name,
        email,
        subject,
        message
    } = req.body;

    // Validate required fields
    if (!student_id || !full_name || !email || !subject || !message) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    // Save the contact message to the database
    const sql = `
        INSERT INTO contact_messages
        (student_id, full_name, email, subject, message)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [student_id, full_name, email, subject, message],
        (err, result) => {
            if (err) {
                console.error('Error saving contact message:', err);

                return res.status(500).json({
                    message: 'Failed to save message'
                });
            }

            // Send the message to ApplyDirect-SA Gmail
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                replyTo: email,
                subject: `Contact Us: ${subject}`,
                text: `
New Contact Us Message

Name: ${full_name}
Email: ${email}
Subject: ${subject}

Message:
${message}
                `
            };

            transporter.sendMail(mailOptions, (emailError, info) => {
                if (emailError) {
                    console.error('Error sending email:', emailError);

                    return res.status(500).json({
                        message: 'Message saved, but email could not be sent',
                        message_id: result.insertId
                    });
                }

                console.log('Email sent:', info.response);

                return res.status(201).json({
                    message: 'Message sent successfully',
                    message_id: result.insertId
                });
            });
        }
    );
};

module.exports = {
    sendMessage
};