const express = require("express");
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/register", createUser);

module.exports = router;
