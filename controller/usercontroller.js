const User = require('../schemas/User'); // Import User Model

// Sử dụng try...catch để xử lý lỗi và trả về response chuẩn

// [C] POST /api/users
exports.createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ 
            message: "Tạo người dùng thành công.", 
            data: newUser 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// [R] GET /api/users (Get All, Search, Pagination)
exports.getAllUsers = async (req, res) => {
    const { search = '', page = 1, limit = 10 } = req.query; // Lấy tham số tìm kiếm, trang, giới hạn
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Tạo điều kiện tìm kiếm tương tự như hàm service trước đó
    const searchCondition = search
        ? {
              $or: [
                  { username: { $regex: search, $options: 'i' } },
                  { fullName: { $regex: search, $options: 'i' } }
              ],
              isDelete: false
          }
        : { isDelete: false };

    try {
        const totalItems = await User.countDocuments(searchCondition);
        const users = await User.find(searchCondition)
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum)
            .populate('role', 'name description');

        res.status(200).json({
            data: users,
            meta: {
                totalItems,
                currentPage: pageNum,
                totalPages: Math.ceil(totalItems / limitNum),
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Lỗi máy chủ khi lấy danh sách người dùng." });
    }
};

// [R] GET /api/users/:id (Get By ID)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDelete: false })
            .populate('role', 'name description');
        
        if (!user) {
            return res.status(404).json({ error: "Không tìm thấy người dùng." });
        }
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({ error: "Lỗi máy chủ." });
    }
};

// [R] GET /api/users/username/:username (Get By Username)
exports.getUserByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username, isDelete: false })
            .populate('role', 'name description');
        
        if (!user) {
            return res.status(404).json({ error: "Không tìm thấy người dùng với Username này." });
        }
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({ error: "Lỗi máy chủ." });
    }
};

// [U] PUT /api/users/:id (Update)
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.id, isDelete: false },
            { $set: req.body },
            { new: true, runValidators: true }
        ).populate('role', 'name description');

        if (!updatedUser) {
            return res.status(404).json({ error: "Không tìm thấy người dùng để cập nhật." });
        }
        res.status(200).json({ 
            message: "Cập nhật người dùng thành công.", 
            data: updatedUser 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// [D] DELETE /api/users/:id (Xóa Mềm - Soft Delete)
exports.softDeleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, isDelete: false },
            { isDelete: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: "Không tìm thấy người dùng để xóa mềm." });
        }
        res.status(200).json({ message: "Xóa mềm người dùng thành công." });
    } catch (error) {
        res.status(500).json({ error: "Lỗi máy chủ khi xóa mềm." });
    }
};

// [Post] POST /api/users/activate (Kích hoạt tài khoản)
exports.activateUser = async (req, res) => {
    const { email, username } = req.body;

    if (!email || !username) {
        return res.status(400).json({ error: "Vui lòng cung cấp Email và Username." });
    }

    try {
        const user = await User.findOne({ 
            email: email, 
            username: username,
            isDelete: false
        });

        if (!user) {
            return res.status(401).json({ error: "Xác thực thất bại: Email hoặc Username không chính xác." });
        }

        if (user.status === true) {
            return res.status(200).json({ message: "Tài khoản này đã được kích hoạt trước đó." });
        }

        user.status = true;
        await user.save();

        res.status(200).json({ 
            message: "Kích hoạt tài khoản thành công.",
            activatedUser: user
        });
    } catch (error) {
        res.status(500).json({ error: "Lỗi máy chủ khi kích hoạt tài khoản." });
    }
};