const connectDB = require("../database/db.js");

// ==========================================
// GET - Get all course data
// ==========================================

const getcoursedata = async (req, res) => {
  try {
    const db = await connectDB();

    const course = db.collection("course");

    const result = await course.find({}).toArray();

    res.send({
      status: 200,
      data: result,
    });

  } catch (error) {

    res.send({
      status: 500,
      message: "Error retrieving course data",
      error: error.message,
    });

  }
};


// ==========================================
// POST - Add course data
// ==========================================

const postcoursedata = async (req, res) => {

  try {

    console.log("POST Course Data:", req.body);

    const db = await connectDB();

    const course = db.collection("course");

    // ------------------------------------------
    // Validate Course ID
    // ------------------------------------------

    if (
      req.body.corseid === undefined ||
      String(req.body.corseid).trim() === ""
    ) {

      return res.send({
        status: 400,
        message: "Course ID is required",
      });

    }

    const courseId = parseInt(req.body.corseid);

    if (isNaN(courseId)) {

      return res.send({
        status: 400,
        message: "Course ID must be a number",
      });

    }


    // ------------------------------------------
    // Check duplicate Course ID
    // ------------------------------------------

    const existingCourse = await course.findOne({
      corseid: courseId,
    });

    if (existingCourse) {

      return res.send({
        status: 400,
        message: "Course ID already exists",
      });

    }


    // ------------------------------------------
    // Create normalized course record
    // ------------------------------------------

    const record = {

      corseid: courseId,

      name: req.body.name,

      coursename: req.body.coursename,

      duration: req.body.duration,

      fees: Number(req.body.fees),

      mode: req.body.mode,

    };


    console.log("Course Record to Insert:", record);


    // ------------------------------------------
    // Insert
    // ------------------------------------------

    const result = await course.insertOne(record);


    if (result.acknowledged === true) {

      res.send({
        status: 200,
        message: "Course data added successfully",
        data: result,
      });

    } else {

      res.send({
        status: 400,
        message: "Failed to add course data",
        data: result,
      });

    }

  } catch (error) {

    res.send({
      status: 500,
      message: "Error adding course data",
      error: error.message,
    });

  }

};


// ==========================================
// PUT - Update course data
// ==========================================

const putcoursedata = async (req, res) => {

  try {

    console.log("PUT Course ID:", req.params.id);

    console.log("PUT Course Data:", req.body);


    // ------------------------------------------
    // Get Course ID from URL
    // ------------------------------------------

    const courseId = parseInt(req.params.id);


    if (isNaN(courseId)) {

      return res.send({
        status: 400,
        message: "Invalid Course ID",
      });

    }


    const db = await connectDB();

    const course = db.collection("course");


    // ------------------------------------------
    // Data to update
    // ------------------------------------------

    const updatedData = {

      name: req.body.name,

      coursename: req.body.coursename,

      duration: req.body.duration,

      fees: Number(req.body.fees),

      mode: req.body.mode,

    };


    console.log("Updated Course Data:", updatedData);


    // ------------------------------------------
    // Update using CORSEID
    // ------------------------------------------

    const result = await course.updateOne(

      {
        corseid: courseId,
      },

      {
        $set: updatedData,
      }

    );


    // ------------------------------------------
    // Course found and updated
    // ------------------------------------------

    if (result.matchedCount > 0) {

      res.send({
        status: 200,
        message: "Course data updated successfully",
        data: result,
        recordid: courseId,
      });

    } else {

      res.send({
        status: 404,
        message: "Course not found",
        data: result,
      });

    }

  } catch (error) {

    res.send({
      status: 500,
      message: "Error updating course data",
      error: error.message,
    });

  }

};


// ==========================================
// DELETE - Delete course data
// ==========================================

const deletecoursedata = async (req, res) => {

  try {

    console.log("DELETE Course ID:", req.query.id);


    // ------------------------------------------
    // Get Course ID from query
    // ------------------------------------------

    const courseId = parseInt(req.query.id);


    if (isNaN(courseId)) {

      return res.send({
        status: 400,
        message: "Invalid Course ID",
      });

    }


    const db = await connectDB();

    const course = db.collection("course");


    // ------------------------------------------
    // Delete using CORSEID
    // ------------------------------------------

    const result = await course.deleteOne({

      corseid: courseId,

    });


    // ------------------------------------------
    // Course deleted
    // ------------------------------------------

    if (result.deletedCount > 0) {

      res.send({

        status: 200,

        message: "Course data deleted successfully",

        data: result,

      });

    } else {

      res.send({

        status: 404,

        message: "Course not found",

        data: result,

      });

    }

  } catch (error) {

    res.send({

      status: 500,

      message: "Error deleting course data",

      error: error.message,

    });

  }

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

  getcoursedata,

  postcoursedata,

  putcoursedata,

  deletecoursedata,

};