const async = require("hbs/lib/async");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signupSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
    unique: true,

    trim: true,
  },
  Password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],

  biodata: {
    profilePic:
    {
        data: Buffer,
        contentType: String,
     
       
    },

    About_me: String,

    ln: String,

    github: String,

    twtr: String,

    fname: String,

    jobtitle: String,

    years_1: String,

    title_1: String,

    companyname_1: String,

    years_2: String,

    title_2: String,

    companyname_2: String,

    clgname_1: String,

    degree_1: String,

    duration_1: String,

    clgname_2: String,

    degree_2: String,

    duration_2: String,

    skill_1: String,

    skill_1_range: Number,

    skill_2: String,

    skill_2_range: Number,

    skill_3: String,

    skill_3_range: Number,

    skill_4: String,

    skill_4_range: Number,
  },
});

signupSchema.methods.genrateAuthToken = async function () {
  try {
    const userToken = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );

    this.tokens = this.tokens.concat({ token: userToken });

    await this.save();

    return userToken;
  } catch (error) {
    console.log(error);
  }
};

signupSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    this.Password = await bcrypt.hash(this.Password, 10);
  }
  next();
});
const signUp = new mongoose.model("ResumeSignUp", signupSchema);
module.exports = signUp;
