const db = require('../config/db');


// =========================
// GET PROFILE
// =========================

const getPortfolio = (req, res) => {
    const profileId = req.params.profile_id;

    // Load the main profile record first so a missing profile can be reported clearly.
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

        // Subjects are stored separately and are returned with the profile response.
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

const getPortfolioByEmail = (req, res) => {
    const email = decodeURIComponent(req.params.email);
    const profileQuery = `
        SELECT *
        FROM student_profiles
        WHERE email = ?
        ORDER BY profile_id DESC
        LIMIT 1
    `;

    db.query(profileQuery, [email], (err, profileResults) => {
        if (err) {
            console.error('Error fetching profile by email:', err);
            return res.status(500).json({ message: 'Error fetching profile' });
        }

        if (profileResults.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const profile = profileResults[0];
        db.query(
            `SELECT subject_id, subject_name, mark, grade
             FROM student_subjects
             WHERE profile_id = ?`,
            [profile.profile_id],
            (subjectError, subjects) => {
                if (subjectError) {
                    console.error('Error fetching subjects:', subjectError);
                    return res.status(500).json({ message: 'Error fetching subjects' });
                }

                res.json({ profile, subjects });
            }
        );
    });
};


// =========================
// CREATE PROFILE
// =========================

const createPortfolio = (req, res) => {

    const {
        student_id,
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        address,
        province,
        school_name,
        matric_year,
        bio,
        profile_picture,
        subjects
    } = req.body;

    const profileQuery = `
        INSERT INTO student_profiles
        (
            student_id,
            first_name,
            last_name,
            email,
            phone,
            date_of_birth,
            address,
            province,
            school_name,
            matric_year,
            bio,
            profile_picture
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        profileQuery,
        [
            student_id,
            first_name,
            last_name,
            email,
            phone,
            date_of_birth,
            address,
            province,
            school_name,
            matric_year,
            bio,
            profile_picture
        ],
        (err, result) => {

            if (err) {
                console.error('Error creating profile:', err);

                return res.status(500).json({
                    message: 'Error creating profile'
                });
            }

            // Use the new profile ID as the foreign key for submitted subjects.
            const profileId = result.insertId;

            if (!subjects || subjects.length === 0) {
                return res.status(201).json({
                    message: 'Profile created successfully',
                    profile_id: profileId
                });
            }

            // Insert all subjects in one database query instead of one query per subject.
            const subjectValues = subjects.map(subject => [
                profileId,
                subject.subject_name,
                subject.mark,
                subject.grade
            ]);

            const subjectsQuery = `
                INSERT INTO student_subjects
                (
                    profile_id,
                    subject_name,
                    mark,
                    grade
                )
                VALUES ?
            `;

            db.query(subjectsQuery, [subjectValues], (err) => {

                if (err) {
                    console.error('Error creating subjects:', err);

                    return res.status(500).json({
                        message: 'Profile created but subjects could not be saved'
                    });
                }

                res.status(201).json({
                    message: 'Profile created successfully',
                    profile_id: profileId
                });
            });
        }
    );
};


// =========================
// UPDATE PROFILE
// =========================

const updatePortfolio = (req, res) => {

    const profileId = req.params.profile_id;

    const {
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        address,
        province,
        school_name,
        matric_year,
        bio,
        profile_picture,
        subjects
    } = req.body;

    const profileQuery = `
        UPDATE student_profiles
        SET
            first_name = ?,
            last_name = ?,
            email = ?,
            phone = ?,
            date_of_birth = ?,
            address = ?,
            province = ?,
            school_name = ?,
            matric_year = ?,
            bio = ?,
            profile_picture = ?
        WHERE profile_id = ?
    `;

    db.query(
        profileQuery,
        [
            first_name,
            last_name,
            email,
            phone,
            date_of_birth,
            address,
            province,
            school_name,
            matric_year,
            bio,
            profile_picture,
            profileId
        ],
        (err, result) => {

            if (err) {
                console.error('Error updating profile:', err);

                return res.status(500).json({
                    message: 'Error updating profile'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Profile not found'
                });
            }

            // Replace the previous subject list with the latest submitted values.
            const deleteSubjectsQuery = `
                DELETE FROM student_subjects
                WHERE profile_id = ?
            `;

            db.query(
                deleteSubjectsQuery,
                [profileId],
                (err) => {

                    if (err) {
                        console.error('Error updating subjects:', err);

                        return res.status(500).json({
                            message: 'Profile updated but subjects could not be updated'
                        });
                    }

                    // If no subjects were submitted, the cleared list is the intended result.
                    if (!subjects || subjects.length === 0) {
                        return res.json({
                            message: 'Profile updated successfully'
                        });
                    }

                    // Insert the replacement subjects in one bulk operation.
                    const subjectValues = subjects.map(subject => [
                        profileId,
                        subject.subject_name,
                        subject.mark,
                        subject.grade
                    ]);

                    const insertSubjectsQuery = `
                        INSERT INTO student_subjects
                        (
                            profile_id,
                            subject_name,
                            mark,
                            grade
                        )
                        VALUES ?
                    `;

                    db.query(
                        insertSubjectsQuery,
                        [subjectValues],
                        (err) => {

                            if (err) {
                                console.error('Error saving subjects:', err);

                                return res.status(500).json({
                                    message: 'Profile updated but subjects could not be saved'
                                });
                            }

                            res.json({
                                message: 'Profile updated successfully'
                            });
                        }
                    );
                }
            );
        }
    );
};


// =========================
// DELETE PROFILE
// =========================

const deletePortfolio = (req, res) => {

    const profileId = req.params.profile_id;

    const deleteQuery = `
        DELETE FROM student_profiles
        WHERE profile_id = ?
    `;

    db.query(deleteQuery, [profileId], (err, result) => {

        if (err) {
            console.error('Error deleting profile:', err);

            return res.status(500).json({
                message: 'Error deleting profile'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Profile not found'
            });
        }

        res.json({
            message: 'Profile deleted successfully'
        });
    });
};


module.exports = {
    getPortfolio,
    getPortfolioByEmail,
    createPortfolio,
    updatePortfolio,
    deletePortfolio
};
