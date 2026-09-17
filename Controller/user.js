
const connectDB = require("../database/db.js");
const em = require("./email.js");

// ==========================================
// GET - Get all user data
// ==========================================

const getuserdata = async (req, res) => {
  try {
    const db = await connectDB();

    const user = db.collection("user");

    const result = await user.find({}).toArray();

    if (result.length > 0) {
      res.send({
        status: 200,
        message: "User data found successfully",
        data: result
      });
    } else {
      res.send({
        status: 404,
        message: "No user data found",
        data: []
      });
    }
  } catch (error) {
    res.send({
      status: 500,
      message: "Error getting user data",
      error: error.message
    });
  }
};

// ==========================================
// POST - Register user
// ==========================================

const postuserdata = async (req, res) => {
  try {
    const db = await connectDB();

    const user = db.collection("user");

    const { userid, username, email, password } = req.body;

    // ==========================================
    // CHECK ALL FIELDS
    // ==========================================

    if (
      userid === undefined ||
      userid === null ||
      username === undefined ||
      username === null ||
      email === undefined ||
      email === null ||
      password === undefined ||
      password === null
    ) {
      return res.send({
        status: 400,
        message: "userid, username, email and password are required"
      });
    }

    // ==========================================
    // CHECK USERNAME
    // ==========================================

    if (username.trim() === "") {
      return res.send({
        status: 400,
        message: "Username cannot be empty"
      });
    }

    // ==========================================
    // CHECK EMAIL
    // ==========================================

    if (email.trim() === "") {
      return res.send({
        status: 400,
        message: "Email cannot be empty"
      });
    }

    // ==========================================
    // CHECK PASSWORD
    // ==========================================

    if (password.trim() === "") {
      return res.send({
        status: 400,
        message: "Password cannot be empty"
      });
    }

    if (password.length < 6) {
      return res.send({
        status: 400,
        message: "Password must be at least 6 characters"
      });
    }

    // ==========================================
    // CHECK USERID
    // ==========================================

    if (isNaN(userid)) {
      return res.send({
        status: 400,
        message: "Userid must be a number"
      });
    }

    // ==========================================
    // CHECK IF USERID ALREADY EXISTS
    // ==========================================

    const existingUserid = await user.findOne({
      userid: parseInt(userid)
    });

    if (existingUserid) {
      return res.send({
        status: 409,
        message: "Userid already exists"
      });
    }

    // ==========================================
    // CHECK IF EMAIL ALREADY EXISTS
    // ==========================================

    const existingEmail = await user.findOne({
      email: email.toLowerCase().trim()
    });

    if (existingEmail) {
      return res.send({
        status: 409,
        message: "Email already exists"
      });
    }

    // ==========================================
    // CREATE USER DATA
    // ==========================================

    const data = {
      userid: parseInt(userid),
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: password
    };

    // ==========================================
    // SAVE USER DATA IN MONGODB
    // ==========================================

    const result = await user.insertOne(data);

    // ==========================================
    // SEND REGISTRATION EMAIL
    // ==========================================

    const emailSent = await em.sendEmail(
      data.email,
      "User Registration Successfully",
      `Hello ${data.username},

Your user registration was successful.

User ID: ${data.userid}
Username: ${data.username}
Email: ${data.email}

Thank you for registering with Softech.`
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    if (emailSent) {
      return res.send({
        status: 200,
        message: "User registered successfully and email sent",
        data: result
      });
    } else {
      return res.send({
        status: 200,
        message: "User registered successfully but email could not be sent",
        data: result
      });
    }

  } catch (error) {
    res.send({
      status: 500,
      message: "Error registering user",
      error: error.message
    });
  }
};

// ==========================================
// PUT - Update user data
// ==========================================

const updateuserdata = async (req, res) => {
  try {
    const db = await connectDB();

    const user = db.collection("user");

    const id = parseInt(req.params.id);

    const { username, email, password } = req.body;

    // ==========================================
    // CHECK ID
    // ==========================================

    if (isNaN(id)) {
      return res.send({
        status: 400,
        message: "Invalid userid"
      });
    }

    // ==========================================
    // CHECK UPDATE DATA
    // ==========================================

    if (
      username === undefined &&
      email === undefined &&
      password === undefined
    ) {
      return res.send({
        status: 400,
        message: "Please provide username, email or password to update"
      });
    }

    const updateData = {};

    // ==========================================
    // UPDATE USERNAME
    // ==========================================

    if (username !== undefined) {
      if (username.trim() === "") {
        return res.send({
          status: 400,
          message: "Username cannot be empty"
        });
      }

      updateData.username = username.trim();
    }

    // ==========================================
    // UPDATE EMAIL
    // ==========================================

    if (email !== undefined) {
      if (email.trim() === "") {
        return res.send({
          status: 400,
          message: "Email cannot be empty"
        });
      }

      updateData.email = email.toLowerCase().trim();
    }

    // ==========================================
    // UPDATE PASSWORD
    // ==========================================

    if (password !== undefined) {
      if (password.trim() === "") {
        return res.send({
          status: 400,
          message: "Password cannot be empty"
        });
      }

      if (password.length < 6) {
        return res.send({
          status: 400,
          message: "Password must be at least 6 characters"
        });
      }

      updateData.password = password;
    }

    // ==========================================
    // UPDATE USER
    // ==========================================

    const result = await user.updateOne(
      {
        userid: id
      },
      {
        $set: updateData
      }
    );

    // ==========================================
    // CHECK USER
    // ==========================================

    if (result.matchedCount === 0) {
      return res.send({
        status: 404,
        message: "User not found"
      });
    }

    res.send({
      status: 200,
      message: "User data updated successfully",
      data: result
    });

  } catch (error) {
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
    const db = await connectDB();

    const user = db.collection("user");

    const id = parseInt(req.params.id);

    // ==========================================
    // CHECK ID
    // ==========================================

    if (isNaN(id)) {
      return res.send({
        status: 400,
        message: "Invalid userid"
      });
    }

    // ==========================================
    // DELETE USER
    // ==========================================

    const result = await user.deleteOne({
      userid: id
    });

    if (result.deletedCount === 0) {
      return res.send({
        status: 404,
        message: "User not found"
      });
    }

    res.send({
      status: 200,
      message: "User data deleted successfully",
      data: result
    });

  } catch (error) {
    res.send({
      status: 500,
      message: "Error deleting user data",
      error: error.message
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getuserdata,
  postuserdata,
  updateuserdata,
  deleteuserdata
};

