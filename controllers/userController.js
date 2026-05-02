
// user controller
import User from '../models/userModel.js';
import asyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken';

// create a register user

export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, email, password });
    res.status(201).json({ message: 'User registered successfully', user });
});

// login user
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // check user exists + password match
    if (!user) {
        return res.status(401).json({ message: 'Invalid email' });
    }
    if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    // generate token
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    // remove password from response
    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
    };

    res.status(200).json({
        message: 'User logged in successfully',
        token,
        user: userData,
    });
});

// delete user
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    await user.remove();
    res.json({ message: 'User deleted successfully' });
});


// get all users
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.json({ message: 'Users retrieved successfully', users });
});

// get user by id
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User retrieved successfully', user });
});

// update user by id
export const updateUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id); 
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const { username, email, password } = req.body;
    user.username = username || user.username; 
    user.email = email || user.email;
    user.password = password || user.password;
    await user.save();
    res.json({ message: 'User updated successfully', user }); 
});
// delete user by id
export const deleteUserById = asyncHandler(async (req, res) => {
    const user =
        await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    await user.remove();

    res.json({ message: 'User deleted successfully' }); 
});

// delete all users
export const deleteAllUsers = asyncHandler(async (req, res) => {
    await User.deleteMany({});
    res.json({ message: 'All users deleted successfully' });
});

// Additional functions for user-machine interactions can be added here, such as:
// - getMachinesForUser
// - assignMachineToUser


