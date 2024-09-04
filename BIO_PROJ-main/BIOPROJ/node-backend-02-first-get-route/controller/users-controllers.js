const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createAdmin = async (req, res, next) => {
  const { name, birth_date, ID, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ ID: ID });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Signing up failed, please try again later." });
  }

  if (existingUser) {
    return res
      .status(422)
      .json({ message: "User exists already, please login instead." });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Could not create user, please try again." });
  }

  const createdUser = new User({
    name,
    birth_date,
    ID,
    password: hashedPassword,
    role: "admin",
    isApproved: true,
  });

  try {
    await createdUser.save();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Signing up failed, please try again later." });
  }

  res
    .status(201)
    .json({ message: "Admin user created successfully!", user: createdUser });
};

const signup = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, birthDate, ID, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ ID: ID });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
    console.log('hashed pass');
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }


  console.log('Data before creating user:', {
    name,
    birthDate,
    ID,
    hashedPassword,
  });

  const createdUser = new User({
    name,
    birth_date: birthDate,
    ID,
    password: hashedPassword,
    role: "pending",
    isApproved: false,
  });

  try {
    await createdUser.save();
    console.log('save user');
  } catch (err) {
    console.error('Error saving user:', err.message);  // Log the error message
    console.error('Error stack:', err.stack);  // Log the full stack trace
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  console.log('i am here');

  res.status(200).json({
    message: "User registered successfully. Awaiting admin approval.",
  });
};

// User login
const login = async (req, res, next) => {
  console.log("login");
  const { ID, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ ID: ID });
    console.log(existingUser);
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    console.log("!existingUser");

    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  if(existingUser.role === 'pending')
  {
    const error = new HttpError(
      "Could not log you in, still on pending mode.",
      341
    );
    return next(error);
  }

  // Instead of generating a JWT token, simply return a success response
  res.json({ message: "OK", role: existingUser.role, userId: existingUser.id });
};

// Get user by ID
const getUserById = async (req, res, next) => {
  console.log(req.params.id);
 try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user data', error: err.message });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    users = await User.find();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a user.",
      500
    );
    return next(error);
  }

  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

const updateRole = async (req, res, next) => {
  const { userId, role } = req.body;
  try {
    const user = await User.findOne({ ID: userId });
    if (!user) {
      return res.status(404).send("User Not Found");
    }

    console.log("User found:", user);

    user.role = role;

    console.log("Attempting to save user with new role:", role);
    await user.save();

    console.log("Save operation successful. Role updated.");
    res.status(200).send("Role updated successfully");
  } catch (error) {
    console.error("Error during role update:", error);
    res.status(500).send("Error updating role");
  }
};

exports.updateRole = updateRole;
exports.createAdmin = createAdmin;
exports.signup = signup;
exports.login = login;
exports.getUserById = getUserById;
exports.getAllUsers = getAllUsers;
