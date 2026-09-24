const connectDB = require("../database/db.js");
const { sendEmail } = require("./email.js");

// ==========================================
// GET - Get all student data
// ==========================================

const getstudentdata = async (req, res) => {
  try {
    const db = await connectDB();

    const student = db.collection("student");

    const result = await student.find({}).toArray();

    if (result.length > 0) {
      res.send({
        status: 200,
        message: "Student data fetched successfully",
        data: result
      });
    } else {
      res.send({
        status: 404,
        message: "No student data found",
        data: []
      });
    }

  } catch (error) {
    console.log("GET Student Error:", error);

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
    console.log("POST Student Body:", req.body);
    console.log("POST Student File:", req.file);

    const db = await connectDB();

    const student = db.collection("student");

    const studentId = Number(req.body.id);

    if (Number.isNaN(studentId)) {
      return res.send({
        status: 400,
        message: "Invalid student ID"
      });
    }

    const existingStudent = await student.findOne({
      id: studentId
    });

    if (existingStudent) {
      return res.send({
        status: 409,
        message: `Student ID ${studentId} already exists`
      });
    }

    // ==========================================
    // MULTER - GET PHOTO NAME
    // ==========================================

    let photo = "";

    if (req.file) {
      photo = req.file.filename;
    }

    const studentData = {
      id: studentId,
      name: req.body.name,
      course: req.body.course,
      email: req.body.email,
      marks: Number(req.body.marks),
      city: req.body.city,
      age: Number(req.body.age),
      photo: photo
    };

    const result = await student.insertOne(studentData);

    if (result.acknowledged === true) {

      let emailSent = false;

      try {
        emailSent = await sendEmail(
          req.body.email,
          "Student Registration Successfully",
          `Hello ${req.body.name}, your student record has been added successfully.`
        );
      } catch (emailError) {
        console.log("Email Error:", emailError.message);
      }

      res.send({
        status: 200,
        message: emailSent
          ? "Student added successfully and email sent"
          : "Student added successfully but email could not be sent",
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
    console.log("POST Student Error:", error);

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
    console.log("Update Student Body:", req.body);
    console.log("Update Student File:", req.file);

    // ======================================
    // Check old ID
    // ======================================

    if (Number.isNaN(oldId)) {

      return res.send({
        status: 400,
        message: "Invalid student ID"
      });

    } else {

      console.log("Student ID is valid:", oldId);

    }

    // ======================================
    // Connect database
    // ======================================

    const db = await connectDB();

    const student = db.collection("student");

    // ======================================
    // Check student exists
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

    } else {

      console.log("Student found:", existingStudent);

    }

    // ======================================
    // Prepare update data
    // ======================================

    const updatedData = {};

    // ======================================
    // ID
    // ======================================

    if (req.body.id !== undefined) {

      const newId = Number(req.body.id);

      if (Number.isNaN(newId)) {

        return res.send({
          status: 400,
          message: "Invalid new student ID"
        });

      } else {

        if (oldId !== newId) {

          const duplicateStudent = await student.findOne({
            id: newId
          });

          if (duplicateStudent) {

            return res.send({
              status: 409,
              message: `Student ID ${newId} already exists`
            });

          } else {

            updatedData.id = newId;

          }

        } else {

          updatedData.id = oldId;

        }

      }

    }

    // ======================================
    // Name
    // ======================================

    if (req.body.name !== undefined) {
      updatedData.name = req.body.name;
    }

    // ======================================
    // Course
    // ======================================

    if (req.body.course !== undefined) {
      updatedData.course = req.body.course;
    }

    // ======================================
    // Email
    // ======================================

    if (req.body.email !== undefined) {
      updatedData.email = req.body.email;
    }

    // ======================================
    // Marks
    // ======================================

    if (req.body.marks !== undefined) {

      const marks = Number(req.body.marks);

      if (Number.isNaN(marks)) {

        return res.send({
          status: 400,
          message: "Invalid marks"
        });

      } else {

        updatedData.marks = marks;

      }

    }

    // ======================================
    // City
    // ======================================

    if (req.body.city !== undefined) {
      updatedData.city = req.body.city;
    }

    // ======================================
    // Age
    // ======================================

    if (req.body.age !== undefined) {

      const age = Number(req.body.age);

      if (Number.isNaN(age)) {

        return res.send({
          status: 400,
          message: "Invalid age"
        });

      } else {

        updatedData.age = age;

      }

    }

    // ======================================
    // MULTER - UPDATE PHOTO
    // ======================================

    if (req.file) {
      updatedData.photo = req.file.filename;
    }

    // ======================================
    // Check whether anything was provided
    // ======================================

    if (Object.keys(updatedData).length === 0) {

      return res.send({
        status: 400,
        message: "Please provide at least one field to update"
      });

    } else {

      console.log("Final Update Data:", updatedData);

    }

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
    // Check result
    // ======================================

    if (result.matchedCount === 0) {

      return res.send({
        status: 404,
        message: "Student not found",
        data: result
      });

    } else {

      if (result.modifiedCount > 0) {

        res.send({
          status: 200,
          message: "Student data updated successfully",
          data: result
        });

      } else {

        res.send({
          status: 200,
          message: "No changes made to student data",
          data: result
        });

      }

    }

  } catch (error) {

    console.log("PUT Student Error:", error);

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

    // Get student name from query
    const studentName = req.query.name;

    console.log("Student name to delete:", studentName);

    // ======================================
    // Check name
    // ======================================

    if (!studentName) {

      return res.send({
        status: 400,
        message: "Student name is required"
      });

    } else {

      console.log("Student name is valid:", studentName);

    }

    // ======================================
    // Connect database
    // ======================================

    const db = await connectDB();

    const student = db.collection("student");

    // ======================================
    // Delete student
    // ======================================

    const result = await student.deleteOne({
      name: studentName
    });

    // ======================================
    // Response
    // ======================================

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

    console.log("DELETE Student Error:", error);

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