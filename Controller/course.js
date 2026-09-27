const connectDB = require("../database/db.js");

// GET - Get all course data
const getcoursedata = async (req, res) => {
    try {
        const db = await connectDB();
        const course = db.collection("course");
        const result = await course.find({}).toArray();

        res.send({
            status: 200,
            data: result
        });
    } catch (error) {
        console.error("GET Course Error:", error);

        res.send({
            status: 500,
            message: "Error retrieving course data",
            error: error.message
        });
    }
};

// POST - Add course data
const postcoursedata = async (req, res) => {
    try {
        console.log("POST Course Data:", req.body);
        console.log("POST Course File:", req.file);

        const db = await connectDB();
        const course = db.collection("course");

        if (req.body.corseid === undefined || String(req.body.corseid).trim() === "") {
            return res.send({
                status: 400,
                message: "Course ID is required"
            });
        }

        const courseId = parseInt(req.body.corseid);

        if (isNaN(courseId)) {
            return res.send({
                status: 400,
                message: "Course ID must be a number"
            });
        }

        const existingCourse = await course.findOne({
            corseid: courseId
        });

        if (existingCourse) {
            return res.send({
                status: 400,
                message: "Course ID already exists"
            });
        }

        const record = {
            corseid: courseId,
            name: req.body.name,
            coursename: req.body.coursename,
            duration: req.body.duration,
            fees: Number(req.body.fees),
            mode: req.body.mode,
            photo: req.file ? req.file.filename : ""
        };

        console.log("Course Record to Insert:", record);

        const result = await course.insertOne(record);

        if (result.acknowledged === true) {
            res.send({
                status: 200,
                message: "Course data added successfully",
                data: result
            });
        } else {
            res.send({
                status: 400,
                message: "Failed to add course data",
                data: result
            });
        }

    } catch (error) {
        console.error("POST Course Error:", error);

        res.send({
            status: 500,
            message: "Error adding course data",
            error: error.message
        });
    }
};

// PUT - Update course data
const putcoursedata = async (req, res) => {
    try {
        console.log("PUT Course ID:", req.params.id);
        console.log("PUT Course Data:", req.body);
        console.log("PUT Course File:", req.file);

        const courseId = parseInt(req.params.id);

        if (isNaN(courseId)) {
            return res.send({
                status: 400,
                message: "Invalid Course ID"
            });
        }

        const db = await connectDB();
        const course = db.collection("course");

        const updatedData = {
            name: req.body.name,
            coursename: req.body.coursename,
            duration: req.body.duration,
            fees: Number(req.body.fees),
            mode: req.body.mode
        };

        if (req.file) {
            updatedData.photo = req.file.filename;
        }

        console.log("Updated Course Data:", updatedData);

        const result = await course.updateOne(
            {
                corseid: courseId
            },
            {
                $set: updatedData
            }
        );

        if (result.matchedCount > 0) {
            res.send({
                status: 200,
                message: "Course data updated successfully",
                data: result,
                recordid: courseId
            });
        } else {
            res.send({
                status: 404,
                message: "Course not found",
                data: result
            });
        }

    } catch (error) {
        console.error("PUT Course Error:", error);

        res.send({
            status: 500,
            message: "Error updating course data",
            error: error.message
        });
    }
};

// DELETE - Delete course data
const deletecoursedata = async (req, res) => {
    try {
        console.log("DELETE Course ID:", req.query.id);

        const courseId = parseInt(req.query.id);

        if (isNaN(courseId)) {
            return res.send({
                status: 400,
                message: "Invalid Course ID"
            });
        }

        const db = await connectDB();
        const course = db.collection("course");

        const result = await course.deleteOne({
            corseid: courseId
        });

        if (result.deletedCount > 0) {
            res.send({
                status: 200,
                message: "Course data deleted successfully",
                data: result
            });
        } else {
            res.send({
                status: 404,
                message: "Course not found",
                data: result
            });
        }

    } catch (error) {
        console.error("DELETE Course Error:", error);

        res.send({
            status: 500,
            message: "Error deleting course data",
            error: error.message
        });
    }
};

module.exports = {
    getcoursedata,
    postcoursedata,
    putcoursedata,
    deletecoursedata
};