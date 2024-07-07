const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');

//rgister user
const register = async (req, res) =>{
    try {
       const { email, password, name } = req.body; 
       //check if user is already registered
       const userExists = await User.findOne({ email });
       if (userExists) {
            throw new CustomError.BadRequestError('User already exists', StatusCodes.CONFLICT);
       }
       //first registered account is admin
       const isFirstAccount = (await User.countDocuments({})) === 0;
       const role = isFirstAccount ? 'admin' : 'user';
       //create new user
       const user = await User.create({ name, email, password, role });
       const tokenUser = createTokenUser(user);
       attachCookiesToResponse({ res, user: tokenUser });
       res.status(StatusCodes.CREATED).json({ user: tokenUser });
    } catch (error) {
        console.error('Error registering user',error);
    }
};

//login user
const login = async (req, res) => {
    try {
      const { email, password } = req.body;
     if (!email || !password) {
        throw new CustomError.BadRequestError('Please provide email and password');
      }
      const user = await User.findOne({ email });
    
      if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
      }
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
      }
      const tokenUser = createTokenUser(user);
      attachCookiesToResponse({ res, user: tokenUser });
    
      res.status(StatusCodes.OK).json({ user: tokenUser });   
    } catch (error) {
        console.error('Error logging in user',error);
    }
};

//logout user
const logout = async (req, res) => {
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now() + 1000),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
  };
    //update user profile pic
    const updateUserProfile = async (req, res) => {
      const { userId } = req.body;
      const profilePicture = req.file;
  
      try {
          if(!userId) {
              throw new CustomError.BadRequestError('Please provide user id');
          }
          let user = await User.findById(userId);
          if (!user) {
              throw new CustomError.NotFoundError('User not found');
          }
  
          if(!profilePicture) {
              throw new CustomError.BadRequestError('Please provide a profile picture');
          } 
          const profilePath = '/uploads/' + profilePicture.filename;
          user.profilePicture = profilePath;
           await user.save();         
              
          res.status(StatusCodes.OK).json({ user });
      } catch (error) {
          res.status(StatusCodes.BAD_REQUEST).json({
              error: error.message
          });
      }
    };
//show current user
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
  
module.exports = { register, login, logout, updateUserProfile, showCurrentUser };