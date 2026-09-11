
const connectDB = require("../database/db.js");

// ==========================================
// GET - Get all student data
// ==========================================

const getstudentdata = async (req, res) => {
  try {

    const db = await connectDB();
    const student = db.collection("student");

    const result = await student.find({}).toArray();

    res.send({
      status: 200,
      data: result
    });

  } catch (error) {

    res.send({
      status: 500,
      message: "Error retrieving student data",
      error: error.message
    });

  }
};


// ==========================================
// POST - Add student data
// ==========================================

const poststudentdata = async (req, res) => {
  try {

    console.log("POST Body:", req.body);

    const db = await connectDB();
    const student = db.collection("student");

    const result = await student.insertOne(req.body);

    if (result.acknowledged === true) {

      res.send({
        status: 200,
        message: "Student data added successfully",
        data: result
      });

    } else {

      res.send({
        status: 400,
        message: "Failed to add student data",
        data: result
      });

    }

  } catch (error) {

    res.send({
      status: 500,
      message: "Error adding student data",
      error: error.message
    });

  }
};


// ==========================================
// PUT - Update student data
// ==========================================

const putstudentdata = async (req, res) => {

  try {

    // ======================================
    // Get OLD ID from URL
    // ======================================

    const oldId = Number(req.params.id);

    console.log("Old Student ID:", oldId);
    console.log("Updated Student Data:", req.body);

    // ======================================
    // Check if ID is valid
    // ======================================

    if (Number.isNaN(oldId)) {

      return res.send({
        status: 400,
        message: "Invalid student ID"
      });

    }

    // ======================================
    // Connect database
    // ======================================

    const db = await connectDB();
    const student = db.collection("student");

    // ======================================
    // Check whether student exists
    // ======================================

    const existingStudent = await student.findOne({
      id: oldId
    });

    if (!existingStudent) {

      return res.send({
        status: 404,
        message: "Student not found",
        data: {
          id: oldId
        }
      });

    }

    // ======================================
    // New ID
    // ======================================

    const newId = Number(req.body.id);

    if (Number.isNaN(newId)) {

      return res.send({
        status: 400,
        message: "Invalid new student ID"
      });

    }

    // ======================================
    // If ID is changed, check duplicate ID
    // ======================================

    if (oldId !== newId) {

      const duplicateStudent = await student.findOne({
        id: newId
      });

      if (duplicateStudent) {

        return res.send({
          status: 409,
          message: `Student ID ${newId} already exists`
        });

      }

    }

    // ======================================
    // Create updated data
    // ======================================

    const updatedData = {

      id: newId,

      name: req.body.name,

      course: req.body.course,

      email: req.body.email,

      marks: Number(req.body.marks),

      city: req.body.city,

      age: Number(req.body.age)

    };

    console.log(
      "Final Update Data:",
      updatedData
    );

    // ======================================
    // Update student
    // ======================================

    const result = await student.updateOne(

      {
        id: oldId
      },

      {
        $set: updatedData
      }

    );

    // ======================================
    // Response
    // ======================================

    if (result.matchedCount === 0) {

      return res.send({
        status: 404,
        message: "Student not found",
        data: result
      });

    }

    if (result.modifiedCount > 0) {

      return res.send({
        status: 200,
        message: "Student data updated successfully",
        data: result
      });

    }

    return res.send({
      status: 200,
      message: "No changes made to student data",
      data: result
    });

  } catch (error) {

    console.error(
      "PUT Student Error:",
      error
    );

    res.send({
      status: 500,
      message: "Error updating student data",
      error: error.message
    });

  }
};


// ==========================================
// DELETE - Delete student data
// ==========================================

const deletestudentdata = async (req, res) => {

  try {

    const studentName = req.query.name;

    console.log(
      "Student name to delete:",
      studentName
    );

    const db = await connectDB();
    const student = db.collection("student");

    const result = await student.deleteOne({
      name: studentName
    });

    if (result.deletedCount > 0) {

      res.send({
        status: 200,
        message: "Student data deleted successfully",
        data: result
      });

    } else {

      res.send({
        status: 404,
        message: "Student not found",
        data: result
      });

    }

  } catch (error) {

    res.send({
      status: 500,
      message: "Error deleting student data",
      error: error.message
    });

  }
};


// ==========================================
// EXPORT ALL FUNCTIONS
// ==========================================

module.exports = {

  getstudentdata,

  poststudentdata,

  putstudentdata,

  deletestudentdata

};
