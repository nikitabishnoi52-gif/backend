
const express = require("express");
const router = express.Router();


const st = require("../Controller/student.js");
const tt = require("../Controller/teacher.js");
const ct = require("../Controller/course.js");
const ut = require("../Controller/user.js");
const upload = require("../multer");

// ==========================================================
// HOME
// ==========================================================

router.get("/home", (req, res) => {
  res.render("home", { name: "Nikita" });
});

// ==========================================================
// STUDENT LIST
// ==========================================================

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

// ==========================================================
// STUDENT APIs
// ==========================================================

/**
 * @swagger
 * /getdata:
 *   get:
 *     summary: Get all students
 *     tags:
 *       - Student
 *     responses:
 *       200:
 *         description: Student data fetched successfully
 */
router.get("/getdata", st.getstudentdata);


/**
 * @swagger
 * /postdata:
 *   post:
 *     summary: Add a new student
 *     tags:
 *       - Student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - course
 *               - email
 *               - marks
 *               - city
 *               - age
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               course:
 *                 type: string
 *               email:
 *                 type: string
 *               marks:
 *                 type: integer
 *               city:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Student added successfully
 */
router.post("/postdata", st.poststudentdata);


/**
 * @swagger
 * /updatedata/{id}:
 *   put:
 *     summary: Update student
 *     tags:
 *       - Student
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Existing student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - course
 *               - email
 *               - marks
 *               - city
 *               - age
 *             properties:
 *               id:
 *                 type: integer
 *                 description: New student ID
 *               name:
 *                 type: string
 *               course:
 *                 type: string
 *               email:
 *                 type: string
 *               marks:
 *                 type: integer
 *               city:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       404:
 *         description: Student not found
 */
router.put("/updatedata/:id", st.putstudentdata);


/**
 * @swagger
 * /deletedata:
 *   delete:
 *     summary: Delete student by name
 *     tags:
 *       - Student
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the student to delete
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 */
router.delete("/deletedata", st.deletestudentdata);


// ==========================================================
// TEACHER APIs
// ==========================================================

/**
 * @swagger
 * /teacherdata:
 *   get:
 *     summary: Get all teachers
 *     tags:
 *       - Teacher
 *     responses:
 *       200:
 *         description: Teacher data fetched successfully
 */
router.get("/teacherdata", tt.getteacherdata);


/**
 * @swagger
 * /postteacherdata:
 *   post:
 *     summary: Add a new teacher
 *     tags:
 *       - Teacher
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teaid
 *               - name
 *               - teasubject
 *               - teacity
 *               - teaemail
 *               - teaphone
 *               - teaqualification
 *             properties:
 *               teaid:
 *                 type: integer
 *               name:
 *                 type: string
 *               teasubject:
 *                 type: string
 *               teacity:
 *                 type: string
 *               teaemail:
 *                 type: string
 *               teaphone:
 *                 type: string
 *               teaqualification:
 *                 type: string
 *     responses:
 *       200:
 *         description: Teacher added successfully
 */
router.post("/postteacherdata", tt.postteacherdata);


/**
 * @swagger
 * /updateteacherdata/{id}:
 *   put:
 *     summary: Update teacher
 *     tags:
 *       - Teacher
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Existing teacher ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - teasubject
 *               - teacity
 *               - teaemail
 *               - teaphone
 *               - teaqualification
 *             properties:
 *               name:
 *                 type: string
 *               teasubject:
 *                 type: string
 *               teacity:
 *                 type: string
 *               teaemail:
 *                 type: string
 *               teaphone:
 *                 type: string
 *               teaqualification:
 *                 type: string
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 *       404:
 *         description: Teacher not found
 */
router.put("/updateteacherdata/:id", tt.putteacherdata);


/**
 * @swagger
 * /deleteteacherdata:
 *   delete:
 *     summary: Delete teacher by ID
 *     tags:
 *       - Teacher
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Teacher ID to delete
 *     responses:
 *       200:
 *         description: Teacher deleted successfully
 *       404:
 *         description: Teacher not found
 */
router.delete("/deleteteacherdata", tt.deleteteacherdata);


// ==========================================================
// COURSE APIs
// ==========================================================

/**
 * @swagger
 * /coursedata:
 *   get:
 *     summary: Get all courses
 *     tags:
 *       - Course
 *     responses:
 *       200:
 *         description: Course data fetched successfully
 */
router.get("/coursedata", ct.getcoursedata);


/**
 * @swagger
 * /postcoursedata:
 *   post:
 *     summary: Add a new course
 *     tags:
 *       - Course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - corseid
 *               - name
 *               - coursename
 *               - duration
 *               - fees
 *               - mode
 *             properties:
 *               corseid:
 *                 type: integer
 *               name:
 *                 type: string
 *               coursename:
 *                 type: string
 *               duration:
 *                 type: string
 *               fees:
 *                 type: number
 *               mode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course added successfully
 */
router.post("/postcoursedata", ct.postcoursedata);


/**
 * @swagger
 * /updatecoursedata/{id}:
 *   put:
 *     summary: Update course
 *     tags:
 *       - Course
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Existing course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - coursename
 *               - duration
 *               - fees
 *               - mode
 *             properties:
 *               name:
 *                 type: string
 *               coursename:
 *                 type: string
 *               duration:
 *                 type: string
 *               fees:
 *                 type: number
 *               mode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 */
router.put("/updatecoursedata/:id", ct.putcoursedata);


/**
 * @swagger
 * /deletecoursedata:
 *   delete:
 *     summary: Delete course by ID
 *     tags:
 *       - Course
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID to delete
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
router.delete("/deletecoursedata", ct.deletecoursedata);


// ==========================================================
// USER APIs
// ==========================================================

/**
 * @swagger
 * /userdata:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User data fetched successfully
 */
router.get("/userdata", ut.getuserdata);


/**
 * @swagger
 * /userinsert:
 *   post:
 *     summary: Add a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userid
 *               - username
 *               - email
 *               - password
 *             properties:
 *               userid:
 *                 type: integer
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User added successfully
 */
router.post("/userinsert", ut.postuserdata);


/**
 * @swagger
 * /updateuserdata/{id}:
 *   put:
 *     summary: Update user
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Existing user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userid
 *               - username
 *               - email
 *               - password
 *             properties:
 *               userid:
 *                 type: integer
 *                 description: New user ID
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put("/updateuserdata/:id", ut.updateuserdata);


/**
 * @swagger
 * /deletedata/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/deletedata/:id", ut.deleteuserdata);


// ==========================================================
// USER LOGIN APIs
// ==========================================================

/**
 * @swagger
 * /userlogin:
 *   post:
 *     summary: Login user using username and password
 *     tags:
 *       - User Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid username or password
 */
router.post("/userlogin", ut.userlogin);


/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login user and send OTP to email
 *     tags:
 *       - User Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       401:
 *         description: Invalid email or password
 */
router.post("/user/login", ut.loginUser);


/**
 * @swagger
 * /user/verify-otp:
 *   post:
 *     summary: Verify email OTP
 *     tags:
 *       - User Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/user/verify-otp", ut.verifyOTP);

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

// ==========================================================
// EXPORT ROUTER
// ==========================================================

module.exports = router;
