
const express = require("express");

const router = express.Router();

const st = require("../Controller/student.js");
const tt = require("../Controller/teacher.js");
const ct = require("../Controller/course.js");
const ut = require("../Controller/user.js");

router.get("/home", (req, res) => {
  res.render("home",
    {
        name: "Nikita"
    });
});

router.get("/studentlist", (req, res) => {
const listnew = [
    {
        id: 1,
        name: "Nikita",
        age: 22,
        course: "MERN",
        email: "nikita@example.com",
        city: "New York",
        marks: 85
    },
    {
        id: 2,
        name: "John",
        age: 24,
        course: "MEAN",
        email: "john@example.com",
        city: "Los Angeles",
        marks: 90
    },
    {
        id: 3,
        name: "Alice",
        age: 21,
        course: "MERN",
        email: "alice@example.com",
        city: "Chicago",
        marks: 88
    },
    {
        id: 4,
        name: "Bob",
        age: 23,
        course: "MEAN",
        email: "bob@example.com",
        city: "Houston",
        marks: 92
    }
];
res.render("student", {listnew });
});
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
// USER APIs
// =====================================================

// GET - Get all user data
router.get("/userdata", ut.getuserdata);

// POST - Add user data
router.post("/user/register", ut.postuserdata);

// PUT - Update user data
router.put("/updateuserdata/:id", ut.updateuserdata);

// DELETE - Delete user data
router.delete("/deletedata/:id", ut.deleteuserdata);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;
