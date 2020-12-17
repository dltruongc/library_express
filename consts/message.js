const CommonMessage = {
  exception: 'Có lỗi xảy ra, vui lòng thử lại sau',
  notFound: 'Lỗi! Không tìm thấy',
  createError: 'Lỗi! Thêm mới thất bại',
  updateError: 'Lỗi! Cập nhật thất bại',
  deleteError: 'Lỗi! Không xoá được',
  invalidIdParams: 'Lỗi! ID không đúng định dạng',
};

module.exports.CommonMessage = CommonMessage;
module.exports.BookMessage = Object.assign({}, CommonMessage);
