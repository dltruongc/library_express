const CommonMessage = {
  exception: "Có lỗi xảy ra, vui lòng thử lại sau",
  notFound: "Lỗi! Không tìm thấy",
  createError: "Lỗi! Thêm mới thất bại",
  updateError: "Lỗi! Cập nhật thất bại",
  deleteError: "Lỗi! Không xoá được",
  invalidIdParams: "Lỗi! ID không đúng định dạng",
  wrongUsername: "Lỗi! Không tìm thấy tên người dùng",
  wrongPassword: "Mật khẩu sai",
  expired: "Phiên đăng nhập đã hết hạn",
  duplicatedUsername: "Tài khoản đã tồn tại",
  unauthorized: "Xác thực thất bại",
};

module.exports.CommonMessage = CommonMessage;
module.exports.BookMessage = Object.assign({}, CommonMessage);
