const db = require('../config/db');
const nodemailer = require('nodemailer');

// Use the configured Gmail account to forward submitted contact messages.
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

    // Reject incomplete submissions before writing anything to the database.
    if (!student_id || !full_name || !email || !subject || !message) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    // Save first so the message is retained even if email delivery fails.
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

            // Forward the saved message to the configured ApplyDirect-SA inbox.
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

                    // The database insert succeeded, so return its ID for tracking.
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

const getMessages = (req, res) => {
    // Return newest contact messages first for the admin message list.
    const sql = `
        SELECT
            message_id,
            student_id,
            full_name,
            email,
            subject,
            message,
            status,
            created_at
        FROM contact_messages
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving contact us messages:', err);

            return res.status(500).json({
                message: 'Failed to retrieve contact us messages'
            });
        }

        res.status(200).json(results);
    });
};

const updateMessage = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Keep message status values consistent with the database workflow.
    const allowedStatuses = ['unread', 'read', 'replied', 'closed'];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: 'Invalid status'
        });
    }

    const sql = `
        UPDATE contact_messages
        SET status = ?
        WHERE message_id = ?
    `;

    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error('Error updating contact message:', err);

            return res.status(500).json({
                message: 'Failed to update contact message'
            });
        }

        // No affected rows means the requested message ID does not exist.
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Contact message not found'
            });
        }

        res.status(200).json({
            message: 'Contact message updated successfully'
        });
    });
};

const deleteMessage = (req, res) => {
    const { id } = req.params;

    const sql = `
        DELETE FROM contact_messages
        WHERE message_id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting contact message:', err);

            return res.status(500).json({
                message: 'Failed to delete contact message'
            });
        }

        // Report a missing message instead of claiming deletion succeeded.
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Contact message not found'
            });
        }

        res.status(200).json({
            message: 'Contact message deleted successfully'
        });
    });
};

module.exports = {
    sendMessage,
    getMessages,
    updateMessage,
    deleteMessage
};
