const User = require("../model/People");
const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");

// get users
async function getUsers(req, res, next) {
  try {
    const users = await User.find();
    res.locals.users = users;
    res.render("users");
  } catch (err) {
    next(err);
  }
}

// add an user
async function addUser(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let newUser;
    if (req.files && req.files.length > 0) {
      newUser = User({
        ...req.body,
        password: hashedPassword,
        avatar: req.files[0].filename,
      });
    } else {
      newUser = User({
        ...req.body,
        password: hashedPassword,
        avatar: "nophoto.png",
      });
    }
    const result = await newUser.save();
    res.status(200).json({
      message: "User was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "There was an server side error to create user!",
        },
      },
    });
  }
}

// delete an user
async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete({
      _id: req.params.id,
    });
    if (user.avatar) {
      unlink(
        path.join(__dirname, `/../public/uploads/avatar/${user.avatar}`),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
    res.status(200).json({
      message: "User was removed successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Couldn't delete the user!",
        },
      },
    });
  }
}
module.exports = { getUsers, addUser, deleteUser };
