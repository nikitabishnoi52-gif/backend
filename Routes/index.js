
const express = require("express");

const router = express.Router();

const st = require("../Controller/student.js");
const tt = require("../Controller/teacher.js");
const ct = require("../Controller/course.js");

// =====================================================
// STUDENT APIs
// =====================================================

// GET - Get all student data
router.get("/getdata", st.getstudentdata);

// POST - Add student data
router.post("/postdata", st.poststudentdata);

// PUT - Update student data by ID
router.put("/updatedata/:id", st.putstudentdata);

// DELETE - Delete student data by name
router.delete("/deletedata", st.deletestudentdata);


// =====================================================
// TEACHER APIs
// =====================================================

// GET - Get all teacher data
router.get("/teacherdata", tt.getteacherdata);

// POST - Add teacher data
router.post("/postteacherdata", tt.postteacherdata);

// PUT - Update teacher data by ID
router.put("/updateteacherdata/:id", tt.putteacherdata);

// DELETE - Delete teacher data
router.delete("/deleteteacherdata", tt.deleteteacherdata);


// =====================================================
// COURSE APIs
// =====================================================

// GET - Get all course data
router.get("/coursedata", ct.getcoursedata);

// POST - Add course data
router.post("/postcoursedata", ct.postcoursedata);

// PUT - Update course data by ID
router.put("/updatecoursedata/:id", ct.putcoursedata);

// DELETE - Delete course data
router.delete("/deletecoursedata", ct.deletecoursedata);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;
