const express = require("express");
const router = express.Router();

const st = require("../Controller/student.js");
const tt = require("../Controller/teacher.js");
const ct = require("../Controller/course.js");
const ut = require("../Controller/user.js");
const upload = require("../multer.js");

// HOME
router.get("/home", (req, res) => {
    res.render("home", { name: "Nikita" });
});

// STUDENT LIST
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

    res.render("student", { listnew });
});

// STUDENT APIs
router.get("/getdata", st.getstudentdata);

router.post("/postdata", upload.single("photo"), st.poststudentdata);

router.put("/updatedata/:id", upload.single("photo"), st.putstudentdata);

router.delete("/deletedata", st.deletestudentdata);

// TEACHER APIs
router.get("/teacherdata", tt.getteacherdata);

router.post("/postteacherdata", tt.postteacherdata);

router.put("/updateteacherdata/:id", tt.putteacherdata);

router.delete("/deleteteacherdata", tt.deleteteacherdata);

// COURSE APIs
router.get("/coursedata", ct.getcoursedata);

router.post("/postcoursedata", ct.postcoursedata);

router.put("/updatecoursedata/:id", ct.putcoursedata);

router.delete("/deletecoursedata", ct.deletecoursedata);

// USER APIs
router.get("/userdata", ut.getuserdata);

router.post("/userinsert", ut.postuserdata);

router.put("/updateuserdata/:id", ut.updateuserdata);

router.delete("/deletedata/:id", ut.deleteuserdata);

// USER LOGIN
router.post("/userlogin", ut.userlogin);

// EMAIL OTP LOGIN
router.post("/user/login", ut.loginUser);

router.post("/user/verify-otp", ut.verifyOTP);

// MULTER UPLOAD
router.post("/upload", upload.single("photo"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: "Please upload a file"
            });
        }

        res.status(200).json({
            status: 200,
            message: "File uploaded successfully",
            file: req.file
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "File upload failed",
            error: error.message
        });
    }
});

module.exports = router;