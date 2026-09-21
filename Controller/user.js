const connectDB = require("../database/db.js");
const { sendEmail } = require("./email.js");

// ==========================================
// GET - Get all user data
// ==========================================

const getuserdata = async (req, res) => {
  try {
    const db = await connectDB();

    const user = db.collection("user");

    const result = await user.find({}).toArray();

    res.send({
      status: 200,
      data: result
    });

  } catch (error) {
    res.send({
      status: 500,
      message: "Error retrieving user data",
      error: error.message
    });
  }
};


// ==========================================
// POST - Add user data
// ==========================================

const postuserdata = async (req, res) => {
  try {

    console.log("POST Body:", req.body);

    const db = await connectDB();

    const user = db.collection("user");

    const userdata = {
      userid: Number(req.body.userid),
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    };

    const result = await user.insertOne(userdata);

    if (result.acknowledged == true) {

      // Send email notification
      let emailSent = false;

      try {
        emailSent = await sendEmail(
          req.body.email,
          "User Registration Successfully",
          `Hello ${req.body.username}, your account has been registered successfully.`
        );
      } catch (emailError) {
        console.log("Email Error:", emailError.message);
      }

      res.send({
        status: 200,
        message: emailSent
          ? "User registered successfully and email sent"
          : "User registered successfully but email could not be sent",
        data: result
      });

    } else {

      res.send({
        status: 400,
        message: "Failed to add user data",
        data: result
      });
    }

  } catch (error) {

    res.send({
      status: 500,
      message: "Error adding user data",
      error: error.message
    });
  }
};


// ==========================================
// PUT - Update user data
// ==========================================

const updateuserdata = async (req, res) => {
  try {

    // ======================================
    // Get OLD ID from URL
    // ======================================

    const oldId = Number(req.params.id);

    console.log("Old User ID:", oldId);
    console.log("Updated User Data:", req.body);

    // ======================================
    // Check ID
    // ======================================

    if (Number.isNaN(oldId)) {

      return res.send({
        status: 400,
        message: "Invalid user ID"
      });

    }

    // ======================================
    // Connect database
    // ======================================

    const db = await connectDB();

    const user = db.collection("user");

    // ======================================
    // Check user exists
    // ======================================

    const existingUser = await user.findOne({
      userid: oldId
    });

    if (!existingUser) {

      return res.send({
        status: 404,
        message: "User not found",
        data: {
          userid: oldId
        }
      });

    }

    // ======================================
    // New User ID
    // ======================================

    const newId = Number(req.body.userid);

    if (Number.isNaN(newId)) {

      return res.send({
        status: 400,
        message: "Invalid new user ID"
      });

    }

    // ======================================
    // Check duplicate ID
    // ======================================

    if (oldId !== newId) {

      const duplicateUser = await user.findOne({
        userid: newId
      });

      if (duplicateUser) {

        return res.send({
          status: 409,
          message: `User ID ${newId} already exists`
        });

      }
    }

    // ======================================
    // Create updated data
    // ======================================

    const updatedData = {

      userid: newId,

      username: req.body.username,

      email: req.body.email,

      password: req.body.password

    };

    console.log(
      "Final Update Data:",
      updatedData
    );

    // ======================================
    // Update user
    // ======================================

    const result = await user.updateOne(

      {
        userid: oldId
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
        message: "User not found",
        data: result
      });

    }

    if (result.modifiedCount > 0) {

      return res.send({
        status: 200,
        message: "User data updated successfully",
        data: result
      });

    }

    return res.send({
      status: 200,
      message: "No changes made to user data",
      data: result
    });

  } catch (error) {

    console.error(
      "PUT User Error:",
      error
    );

    res.send({
      status: 500,
      message: "Error updating user data",
      error: error.message
    });

  }
};


// ==========================================
// DELETE - Delete user data
// ==========================================

const deleteuserdata = async (req, res) => {

  try {

    // Get ID from URL
    const userid = Number(req.params.id);

    console.log(
      "User ID to delete:",
      userid
    );

    // ======================================
    // Check ID
    // ======================================

    if (Number.isNaN(userid)) {

      return res.send({
        status: 400,
        message: "Invalid user ID"
      });

    }

    // ======================================
    // Connect database
    // ======================================

    const db = await connectDB();

    const user = db.collection("user");

    // ======================================
    // Delete user
    // ======================================

    const result = await user.deleteOne({
      userid: userid
    });

    // ======================================
    // Response
    // ======================================

    if (result.deletedCount > 0) {

      res.send({
        status: 200,
        message: "User data deleted successfully",
        data: result
      });

    } else {

      res.send({
        status: 404,
        message: "User not found",
        data: result
      });

    }

  } catch (error) {

    res.send({
      status: 500,
      message: "Error deleting user data",
      error: error.message
    });

  }
}; 

// ==========================================
// POST - User Login
// ==========================================

const userlogin = async (req, res) => {
  try {

    const { username, password } = req.body;

    const db = await connectDB();
    const user = db.collection("user");

    const result = await user.findOne({
      username: username,
      password: password
    });

    if (!result) {
      return res.send({
        status: 401,
        message: "Invalid username or password"
      });
    }

    res.send({
      status: 200,
      message: "Login successful",
      data: {
        userid: result.userid,
        username: result.username,
        email: result.email
      }
    });

  } catch (error) {

    res.send({
      status: 500,
      message: "Error during login",
      error: error.message
    });

  }
};


// ==========================================
// EXPORT ALL FUNCTIONS
// ==========================================

module.exports = {

  getuserdata,

  postuserdata,

  updateuserdata,

  deleteuserdata,

  userlogin

};