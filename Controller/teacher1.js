
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

        console.log("POST Teacher Data:", req.body);

        const db = await connectDB();

        const teacher = db.collection("teacher");


        // Check required ID
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


        // Check if teacher ID already exists

        const existingTeacher = await teacher.findOne({
            teaid: teacherId
        });


        if (existingTeacher) {

            return res.send({
                status: 400,
                message: "Teacher ID already exists"
            });

        }


        // Make sure teaid is stored as number

        const record = {
            teaid: teacherId,
            name: req.body.name,
            teasubject: req.body.teasubject,
            teacity: req.body.teacity,
            teaemail: req.body.teaemail,
            teaphone: req.body.teaphone,
            teaqualification: req.body.teaqualification
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
// URL:
// PUT /updateteacherdata/:id
// Example:
// PUT /updateteacherdata/17
// =====================================================

const putteacherdata = async (req, res) => {

    try {

        console.log("PUT ID:", req.params.id);
        console.log("PUT Body:", req.body);


        // Get teacher ID from URL

        const teacherId = parseInt(req.params.id);


        // Validate ID

        if (isNaN(teacherId)) {

            return res.send({
                status: 400,
                message: "Invalid teacher ID"
            });

        }


        const db = await connectDB();

        const teacher = db.collection("teacher");


        // Only update these fields

        const updatedData = {

            name: req.body.name,
            teasubject: req.body.teasubject,
            teacity: req.body.teacity,
            teaemail: req.body.teaemail,
            teaphone: req.body.teaphone,
            teaqualification: req.body.teaqualification

        };


        console.log("Updating teacher ID:", teacherId);

        console.log("Updated Data:", updatedData);


        const result = await teacher.updateOne(

            // IMPORTANT:
            // MongoDB field is teaid

            {
                teaid: teacherId
            },

            {
                $set: updatedData
            }

        );


        console.log("Update Result:", result);


        // Teacher does not exist

        if (result.matchedCount === 0) {

            return res.send({

                status: 404,

                message: "Teacher not found",

                recordid: teacherId

            });

        }


        // Teacher found but no values changed

        if (result.modifiedCount === 0) {

            return res.send({

                status: 200,

                message: "Teacher found but no data was changed",

                recordid: teacherId,

                data: result

            });

        }


        // Successfully updated

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
// URL:
// DELETE /deleteteacherdata?id=17
//
// Example:
// DELETE http://localhost:3001/deleteteacherdata?id=17
// =====================================================

const deleteteacherdata = async (req, res) => {

    try {

        console.log("DELETE Query:", req.query);


        // Get ID from query

        const teacherId = parseInt(req.query.id);


        // Validate ID

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

            // IMPORTANT:
            // MongoDB field is teaid

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
