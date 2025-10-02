let mongoose = require('mongoose');

// Định nghĩa Schema cho đối tượng Role
let RoleSchema = new mongoose.Schema({
    // name: string, unique, required
    name: {
        type: String,
        required: [true, "Tên vai trò không được để trống."],
        unique: true,
    },
    // description: string, default: ""
    description: {
        type: String,
        default: "",
    },
    // isDelete: boolean, default: false
    isDelete: {
        type: Boolean,
        default: false,
    }
}, {
    // timestamp
    timestamps: true // Tự động thêm createdAt và updatedAt
});

// Xuất mô hình Role (Tên collection sẽ là 'roles')
module.exports = mongoose.model('Role', RoleSchema);