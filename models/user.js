const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Anonymous",
  },
  avatar: {
    type: String,
    validate: {
      validator: function isUrl(v) {
        return validator.isURL(v);
      },
      message: "Invalid URL format",
    },
    default: "https://default-avatar.com/image.png",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function isEmail(v) {
        return validator.isEmail(v);
      },
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
});

// LOGIN
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  const userFound = (user) => {
    if (!user) {
      return Promise.reject(new Error("Incorrect email or password"));
    }

    const passwordChecked = (matched) => {
      if (!matched) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return user;
    };

    return bcrypt.compare(password, user.password).then(passwordChecked);
  };

  return this.findOne({ email }).select("+password").then(userFound);
};

// HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function hashPassword(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("user", userSchema);
