// Import necessary modules
const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const {tr} = require("faker/lib/locales");

// Define post schema
const postSchema = mongoose.Schema(
  {
    subject: {
      type: String,
    },
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    like_count: {
      type: Number,
      default: 0,
    },
    comment_count: {
      type: Number,
      default: 0,
    },
    interaction_count: {
      type: Number,
      default: 0,
    },
    interact: {
      type: Number,
      default: 0,
    },
    views_count: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Tiểu thuyết',
        'Truyện ngắn',
        'Truyện dài',
        'Truyện tranh',
        'Kinh dị',
        'Phiêu lưu',
        'Hài hước',
        'Tình cảm',
        'Khoa học viễn tưởng',
        'Lịch sử',
        'Học đường',
        'Văn học cổ điển',
        'Văn học hiện đại',
        'Trinh thám',
        'Văn học nước ngoài',
        'Cổ tích',
        'Viễn tưởng',
        'Kịch',
        'Hành động',
        'Bí ẩn',
        'Tâm lý',
        'Công nghệ',
        'Lãng mạn',
        'Văn học Việt Nam',
        'Tự truyện',
        'Suy ngẫm',
        'Đời sống',
        'Huyền bí',
        'Tưởng tượng',
        'Tài liệu',
        'Thể thao',
        'Kinh tế',
        'Chính trị',
        'Tôn giáo',
        'Sức khỏe',
        'Manga',
        'Light Novel',
        'Đam mỹ',
        'Lịch sử hư cấu',
        'Du ký',
        'Xuyên không',
        'Harem',
        'Trọng sinh',
        'Ngôn tình',
        'Cổ điển Trung Quốc',
        'Ngôn tình sắc',
        'Điện ảnh',
        'Âm nhạc',
        'Thiếu nhi',
        'Kỳ ảo',
        'Ngôn tình hiện đại',
        'Khác',
      ],
    },
    user_id: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Apply plugins to schema
postSchema.plugin(toJSON);
postSchema.plugin(paginate);

// Export post model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
