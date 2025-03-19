const mongoose = require("mongoose");

const UserType = {
  STUDENT: "student",
  ALUMNI: "alumni",
  FACULTY: "faculty",
  CLUB_COORDINATOR: "clubCoordinator",
  ADMIN: "admin",
};

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { 
    type: String, 
    unique: true, 
    required: true,
    validate: {
      validator: function(v) {
        // Validate email domain only for students and faculty
        if (this.userType === UserType.STUDENT || this.userType === UserType.ALUMNI) {
          return /@rguktrkv\.ac\.in$/.test(v);
        }
        // Allow any email for other user types
        return true;
      },
      message: props => `${props.value} is not a valid email domain for this user type!`
    }
  },
  password: { type: String },
  googleId: { type: String },
  avatar: { type: String },
  verified: { type: Boolean, default: false },
  userType: { 
    type: String, 
    enum: Object.values(UserType), // Ensure userType is one of the defined types
    
  }
});

// Export the User model
module.exports = mongoose.model("User ", UserSchema);
