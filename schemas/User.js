let mongoose = require('mongoose');

// Định nghĩa Schema cho đối tượng User
let UserSchema = new mongoose.Schema({
    // username: string, unique, required
    username: {
        type: String,
        required: [true, "Tên đăng nhập không được để trống."],
        unique: true,
    },
    // password: string, required
    password: {
        type: String,
        required: [true, "Mật khẩu không được để trống."],
    },
    // email: string, required, unique
    email: {
        type: String,
        required: [true, "Email không được để trống."],
        unique: true,
    },
    // fullName: string, default: ""
    fullName: {
        type: String,
        default: "",
    },
    // avatarUrl: string, default: ""
    avatarUrl: {
        type: String,
        default: "",
    },
    // status: boolean, default: false
    status: {
        type: Boolean,
        default: false,
    },
    
    role: {
        // Nếu bạn muốn tham chiếu đến một collection khác, hãy dùng mongoose.Schema.Types.ObjectId
        type: mongoose.Schema.Types.ObjectId,
        // Ref là tên của mô hình Role
        ref: 'Role', 
        required: [true, "Vai trò (Role) không được để trống."],
    },
    // loginCount: int, default: 0, min=0
    loginCount: {
        type: Number,
        default: 0,
        min: [0, "Số lần đăng nhập không được nhỏ hơn 0."],
    },
    // isDelete: boolean, default: false
    isDelete: {
        type: Boolean,
        default: false,
    }
}, {
    
    timestamps: true 
});
module.exports = mongoose.model('User', UserSchema);