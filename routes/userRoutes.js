import express from "express";

import {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    deleteAllUsers,

} from "../controllers/userController.js";

const router = express.Router();


// General User Management
router.route("/").get(getAllUsers).post(registerUser).delete(deleteAllUsers);

router.route("/login").post(loginUser);

router
  .route("/:id")
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

export default router;

