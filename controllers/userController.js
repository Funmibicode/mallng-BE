import User from "../models/UserModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";

// @desc Register user
const registerUser = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};

// @desc Login user
const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// @desc Logout user
const logoutUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "logout failed" });
    }

    res.status(200).json({ msg: "user logout successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// @desc Get logged-in user's profile
const getUser = async (req, res) => {
  try {
    const user = req.user;

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

export { registerUser, logInUser, logoutUser, getUser };