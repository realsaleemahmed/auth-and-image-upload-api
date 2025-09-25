const User = require('../models/user.js');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
//register controller
const registerUser = async (req, res) => {
  try {
    //extract user info from request body
    const {username, email, password, role} = req.body;
    //check if the user already exist in db
    const checkExistingUser = await User.findOne({$or : [{username}, {email}]});
    if(checkExistingUser) {
      return res.status(400).json({
        success : false,
        message : 'User already registered try different username or email'
      })
    }

    //hash user password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    // //create a new user and save in your database another method to create this is 
    // /* 
    //   const newlyCreatedUser =  await User.create({
    //   username,
    //   email,
    //   password : hashedPassword,
    //   role : role || 'user'
    // })
    // */
    const newlyCreatedUser = new User({
      username,
      email,
      password : hashedPassword,
      role : role || 'user'
    })

    await newlyCreatedUser.save();

    if(newlyCreatedUser) {
      res.status(201).json({
        success : true,
        message : 'User registerd succesfully'
      })
    } else {
        res.status(400).json({
        success : false,
        message : 'Unable to register user'
      })
    }


  } catch(e) {
    console.log(e);
    res.status(500).json({
      success : false,
      message : 'Something went wrong error occured!'
    })
  }
}

//login controller

const loginUser = async (req, res) => {
  try {
    const {username , password} = req.body;
    //find if the current user exists in database

    const user = await User.findOne({username}); //this user holds everything
    if(!user) {
      return res.status(400).json({
        success : false,
        message : 'User doesnt exist '
      })
    }
    //if the password is correct or not
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch) {
      return res.status(400).json({
        success : false,
        message : 'Invalid credentials'
      })      
    } 
    //token based on user info using bearer token
    const accessToken = jwt.sign({  //imp keyword
      userId : user._id,
      username : user.username,
      role : user.role
    }, process.env.JWT_SECRET_KEY, {
       expiresIn : '15m'
    })

    res.status(200).json({
      success : true,
      message : 'Logged in successful',
      accessToken
    })
  } catch(e) {
    console.log(e);
    res.status(500).json({
      success : false,
      message : 'Something went wrong error occured!'
    })
  }
}

const changePassword = async (req,res) => {
  try {
    const userId = req.userInfo.userId;

    //extract old and new password ; u should handle same old and new password through frontend
    const {oldPassword, newPassword} = req.body;

    //find the current logged in user
    const user = await User.findById(userId);

    if(!user) {
      return res.status(400).json({
        success : false,
        message : 'User not found'
      })
    }
    //check if old password is correct
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if(!isPasswordMatch) {
      return res.status(400).json({
        success : false,
        message : 'old password is not correct try again'
      })
    }

    //hash the new password

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    //update user password
    user.password = newHashedPassword
    await user.save();

    res.status(200).json({
      success : true,
      message : 'Password save successfully'
    })
  } catch(e) {
    console.log(e);
    res.status(500).json({
      success : false,
      message : 'Something went wrong error occured!'
    })
  }
}

module.exports = {loginUser, registerUser, changePassword};