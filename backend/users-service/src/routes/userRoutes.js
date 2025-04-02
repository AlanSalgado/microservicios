const express = require("express");
const { getAllUsers, getUserById, createUser, loginUser , updateUser, deleteUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginUser);
router.post("/", createUser);

router.get("/", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
