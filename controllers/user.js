const User = require('../models/user');

exports.getUser = async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  return res.json(user);
};

exports.postEditUser = async (req, res, next) => {
  const { id, name, photo } = req.body;
  const userEdit = await User.findById(id);
  userEdit.name = name;
  userEdit.photo = photo;
  await userEdit.save();
  res.status(200).json({
    message: 'Cập nhật thông tin thành công!', userEdit: {
      id: userEdit._id,
      name: userEdit.name,
      email: userEdit.email,
      photo: userEdit.photo,
      role: userEdit.role,
    },
  })
};
