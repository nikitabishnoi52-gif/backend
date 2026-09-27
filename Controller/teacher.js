const connectDB = require("../database/db.js");

// =====================================================
// GET - Get all teacher data
// =====================================================

const getteacherdata = async (req, res) => {
    try {
        const db = await connectDB();
        const teacher = db.collection("teacher");
        const result = await teacher.find({}).toArray();

        res.send({
            status: 200,
            data: result
        });

    } catch (error) {
        console.error("GET Teacher Error:", error);

        res.send({
            status: 500,
            message: "Error retrieving teacher data",
            error: error.message
        });
    }
};

// =====================================================
// POST - Add teacher data
// =====================================================

const postteacherdata = async (req, res) => {
    try {
        console.log("POST Teacher Body:", req.body);
        console.log("POST Teacher File:", req.file);

        const db = await connectDB();
        const teacher = db.collection("teacher");

        if (
            req.body.teaid === undefined ||
            req.body.teaid === null ||
            req.body.teaid === ""
        ) {
            return res.send({
                status: 400,
                message: "Teacher ID is required"
            });
        }

        const teacherId = parseInt(req.body.teaid);

        if (isNaN(teacherId)) {
            return res.send({
                status: 400,
                message: "Teacher ID must be a number"
            });
        }

        const existingTeacher = await teacher.findOne({
            teaid: teacherId
        });

        if (existingTeacher) {
            return res.send({
                status: 400,
                message: "Teacher ID already exists"
            });
        }

        const record = {
            teaid: teacherId,
            name: req.body.name,
            teasubject: req.body.teasubject,
            teacity: req.body.teacity,
            teaemail: req.body.teaemail,
            teaphone: req.body.teaphone,
            teaqualification: req.body.teaqualification,
            photo: req.file ? req.file.filename : ""
        };

        const result = await teacher.insertOne(record);

        if (result.acknowledged === true) {
            res.send({
                status: 200,
                message: "Teacher data added successfully",
                data: result
            });
        } else {
            res.send({
                status: 400,
                message: "Failed to add teacher data",
                data: result
            });
        }

    } catch (error) {
        console.error("POST Teacher Error:", error);

        res.send({
            status: 500,
            message: "Error adding teacher data",
            error: error.message
        });
    }
};

// =====================================================
// PUT - Update teacher data by teaid
// =====================================================

const putteacherdata = async (req, res) => {
    try {
        console.log("PUT Teacher ID:", req.params.id);
        console.log("PUT Teacher Body:", req.body);
        console.log("PUT Teacher File:", req.file);

        const teacherId = parseInt(req.params.id);

        if (isNaN(teacherId)) {
            return res.send({
                status: 400,
                message: "Invalid teacher ID"
            });
        }

        const db = await connectDB();
        const teacher = db.collection("teacher");

        const updatedData = {
            name: req.body.name,
            teasubject: req.body.teasubject,
            teacity: req.body.teacity,
            teaemail: req.body.teaemail,
            teaphone: req.body.teaphone,
            teaqualification: req.body.teaqualification
        };

        if (req.file) {
            updatedData.photo = req.file.filename;
        }

        console.log("Updating teacher ID:", teacherId);
        console.log("Updated Data:", updatedData);

        const result = await teacher.updateOne(
            {
                teaid: teacherId
            },
            {
                $set: updatedData
            }
        );

        console.log("Update Result:", result);

        if (result.matchedCount === 0) {
            return res.send({
                status: 404,
                message: "Teacher not found",
                recordid: teacherId
            });
        }

        if (result.modifiedCount === 0) {
            return res.send({
                status: 200,
                message: "Teacher found but no data was changed",
                recordid: teacherId,
                data: result
            });
        }

        res.send({
            status: 200,
            message: "Teacher data updated successfully",
            data: result,
            recordid: teacherId
        });

    } catch (error) {
        console.error("PUT Teacher Error:", error);

        res.send({
            status: 500,
            message: "Error updating teacher data",
            error: error.message
        });
    }
};

// =====================================================
// DELETE - Delete teacher data by teaid
// =====================================================

const deleteteacherdata = async (req, res) => {
    try {
        console.log("DELETE Query:", req.query);

        const teacherId = parseInt(req.query.id);

        if (isNaN(teacherId)) {
            return res.send({
                status: 400,
                message: "Invalid teacher ID"
            });
        }

        const db = await connectDB();
        const teacher = db.collection("teacher");

        console.log("Deleting teacher ID:", teacherId);

        const result = await teacher.deleteOne({
            teaid: teacherId
        });

        console.log("Delete Result:", result);

        if (result.deletedCount > 0) {
            res.send({
                status: 200,
                message: "Teacher data deleted successfully",
                recordid: teacherId
            });
        } else {
            res.send({
                status: 404,
                message: "Teacher not found",
                recordid: teacherId
            });
        }

    } catch (error) {
        console.error("DELETE Teacher Error:", error);

        res.send({
            status: 500,
            message: "Error deleting teacher data",
            error: error.message
        });
    }
};

// =====================================================
// EXPORT ALL FUNCTIONS
// =====================================================

module.exports = {
    getteacherdata,
    postteacherdata,
    putteacherdata,
    deleteteacherdata
};