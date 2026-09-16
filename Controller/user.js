
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
// POST - Add user data
// ==========================================

const postuserdata = async (req, res) => {
  try {

    const db = await connectDB();

    const user = db.collection("user");

    const { userid, username, email } = req.body;


    // ==========================================
    // CHECK ALL FIELDS
    // ==========================================

    if (
      userid === undefined ||
      userid === null ||
      username === undefined ||
      username === null ||
      email === undefined ||
      email === null
    ) {

      res.send({
        status: 400,
        message: "userid, username and email are required"
      });

    } else {

      // ==========================================
      // CHECK USERNAME
      // ==========================================

      if (username.trim() === "") {

        res.send({
          status: 400,
          message: "Username cannot be empty"
        });

      }

      // ==========================================
      // CHECK EMAIL
      // ==========================================

      else if (email.trim() === "") {

        res.send({
          status: 400,
          message: "Email cannot be empty"
        });

      }

      // ==========================================
      // CHECK USERID
      // ==========================================

      else if (isNaN(userid)) {

        res.send({
          status: 400,
          message: "Userid must be a number"
        });

      }

      else {

        // ==========================================
        // CHECK IF USERID ALREADY EXISTS
        // ==========================================

        const existingUserid = await user.findOne({
          userid: parseInt(userid)
        });

        if (existingUserid) {

          res.send({
            status: 409,
            message: "Userid already exists"
          });

        }

        else {

          // ==========================================
          // CHECK IF EMAIL ALREADY EXISTS
          // ==========================================

          const existingEmail = await user.findOne({
            email: email.toLowerCase().trim()
          });

          if (existingEmail) {

            res.send({
              status: 409,
              message: "Email already exists"
            });

          }

          else {

            const data = {
              userid: parseInt(userid),
              username: username.trim(),
              email: email.toLowerCase().trim()
            };


            const result = await user.insertOne(data);


            // ==========================================
            // SEND EMAIL
            // ==========================================

            await em.sendEmail(
              data.email,
              "User Registration Successfully",
              `Hello ${data.username},

Your user registration was successful.

User ID: ${data.userid}
Username: ${data.username}
Email: ${data.email}

Thank you for registering with Softech.`
            );


            res.send({
              status: 200,
              message: "User data inserted successfully",
              data: result
            });

          }

        }

      }

    }

  } catch (error) {

    res.send({
      status: 500,
      message: "Error inserting user data",
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

    const { username, email } = req.body;


    // ==========================================
    // CHECK ID
    // ==========================================

    if (isNaN(id)) {

      res.send({
        status: 400,
        message: "Invalid userid"
      });

    }

    // ==========================================
    // CHECK USERNAME AND EMAIL
    // ==========================================

    else if (
      username === undefined &&
      email === undefined
    ) {

      res.send({
        status: 400,
        message: "Please provide username or email to update"
      });

    }

    else {

      const updateData = {};


      // ==========================================
      // USERNAME
      // ==========================================

      if (username !== undefined) {

        if (username.trim() === "") {

          res.send({
            status: 400,
            message: "Username cannot be empty"
          });

          return;
        }

        updateData.username = username.trim();

      }


      // ==========================================
      // EMAIL
      // ==========================================

      if (email !== undefined) {

        if (email.trim() === "") {

          res.send({
            status: 400,
            message: "Email cannot be empty"
          });

          return;
        }

        updateData.email = email.toLowerCase().trim();

      }


      const result = await user.updateOne(
        {
          userid: id
        },
        {
          $set: updateData
        }
      );


      if (result.matchedCount === 0) {

        res.send({
          status: 404,
          message: "User not found"
        });

      }

      else {

        res.send({
          status: 200,
          message: "User data updated successfully",
          data: result
        });

      }

    }

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

      res.send({
        status: 400,
        message: "Invalid userid"
      });

    }

    else {

      const result = await user.deleteOne({
        userid: id
      });


      if (result.deletedCount === 0) {

        res.send({
          status: 404,
          message: "User not found"
        });

      }

      else {

        res.send({
          status: 200,
          message: "User data deleted successfully",
          data: result
        });

      }

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
// EXPORT
// ==========================================

module.exports = {
  getuserdata,
  postuserdata,
  updateuserdata,
  deleteuserdata
};
