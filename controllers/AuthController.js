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
  
module.exports = { register, login, logout };