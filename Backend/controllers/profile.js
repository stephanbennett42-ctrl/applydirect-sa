const db = require('../config/db');

const getPortfolio = (req, res) => {
    const profileId = req.params.profile_id;

    const profileQuery = `
        SELECT *
        FROM student_profiles
        WHERE profile_id = ?
    `;

    db.query(profileQuery, [profileId], (err, profileResults) => {
        if (err) {
            console.error('Error fetching profile:', err);
            return res.status(500).json({
                message: 'Error fetching profile'
            });
        }

        if (profileResults.length === 0) {
            return res.status(404).json({
                message: 'Profile not found'
            });
        }

        const subjectsQuery = `
            SELECT subject_id, subject_name, mark, grade
            FROM student_subjects
            WHERE profile_id = ?
        `;

        db.query(subjectsQuery, [profileId], (err, subjectResults) => {
            if (err) {
                console.error('Error fetching subjects:', err);
                return res.status(500).json({
                    message: 'Error fetching subjects'
                });
            }

            res.json({
                profile: profileResults[0],
                subjects: subjectResults
            });
        });
    });
};

module.exports = {
    getPortfolio
};