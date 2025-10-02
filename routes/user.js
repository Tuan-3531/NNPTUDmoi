const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// [C] Tạo User mới
router.post('/', userController.createUser);

// [R] Lấy tất cả User (bao gồm tìm kiếm)
router.get('/', userController.getAllUsers);

// [R] Lấy User theo ID
router.get('/:id', userController.getUserById);

// [R] Lấy User theo Username
router.get('/username/:username', userController.getUserByUsername); 

// [U] Cập nhật User
router.put('/:id', userController.updateUser);

// [D] Xóa mềm User
router.delete('/:id', userController.softDeleteUser);

// [Post] Kích hoạt tài khoản
router.post('/activate', userController.activateUser); 

module.exports = router;