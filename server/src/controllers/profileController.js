import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = req.body.name ?? user.name;
  user.email = req.body.email ?? user.email;
  if (req.body.password) {
    user.password = req.body.password;
  }
  if (req.file) {
    user.avatar = `/uploads/${req.file.filename}`;
  }

  const updatedUser = await user.save();

  res.json({
    message: "Profile updated successfully",
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
    },
  });
});
