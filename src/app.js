// npm
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const hbs = require("hbs");
const path = require("path");
var popupS = require('sweetalert');
const cookieParser = require("cookie-parser");
const upload = require("./middleware/imageUploader");
const fs = require("fs");

// App Setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// middleWare
const auth = require("../src/middleware/auth");

// DB
const db = require("./db/conn");
const signUp = require("./models/signupSchema");


// path
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));

const template_path = path.join(__dirname, "../templates/views");
app.set("views", template_path);

const partials_path = path.join(__dirname, "../templates/partials");
hbs.registerPartials(partials_path);

// View Engine
app.set("view engine", "hbs");


hbs.registerHelper('toString',function(str) {
  return str.toString('base64');
});

// path for imgs
app.use(express.static("templates/views/images"));


// running on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`at port ${port}`);
});

let userDataReq;

app.get("/resume/:ResumeEmail", async (req, res) => {
  
  var updateddata = await signUp.find({ Email: req.params.ResumeEmail });

  res.render("resume", { bioData: updateddata });
});

app.get("/", auth, async (req, res) => {
  let Email = req.userdata.Email;
  var updateddata = await signUp.find({ Email: Email });

  res.status(201).render("form", { bioData: updateddata });
});

app.get("/loginSignup", (req, res) => {
  
  res.render("loginSignup");
});

app.post("/formSubmit", upload.single('profilepicture'), async (req, res) => {
  const filter = { Email: req.body.userEmail };
  // console.log(req.file.filename)
 
  
    
      
      const pic= await{
        data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
        contentType: req.file.mimetype
      }
    
  
  try{
    let formData = await signUp.updateMany(
      { Email: req.body.userEmail },
      {
        $set: {
          "biodata.profilePic": pic,
          "biodata.About_me": req.body.About_me,
          "biodata.ln": req.body.ln,
          "biodata.github": req.body.github,
          "biodata.twtr": req.body.twtr,

          "biodata.fname": req.body.fname,
          "biodata.jobtitle": req.body.jobtitle,
          "biodata.years_1": req.body.years_1,
          "biodata.title_1": req.body.title_1,
          "biodata.companyname_1": req.body.companyname_1,
          "biodata.years_2": req.body.years_2,
          "biodata.title_2": req.body.title_2,
          "biodata.companyname_2": req.body.companyname_2,
          "biodata.clgname_1": req.body.clgname_1,
          "biodata.degree_1": req.body.degree_1,
          "biodata.duration_1": req.body.duration_1,
          "biodata.clgname_2": req.body.clgname_2,
          "biodata.degree_2": req.body.degree_2,
          "biodata.duration_2": req.body.duration_2,
          "biodata.skill_1": req.body.skill_1,
          "biodata.skill_1_range": req.body.skill_1_range,

          "biodata.skill_2": req.body.skill_2,
          "biodata.skill_2_range": req.body.skill_2_range,
          "biodata.skill_3": req.body.skill_3,
          "biodata.skill_3_range": req.body.skill_3_range,
          "biodata.skill_4": req.body.skill_4,
          "biodata.skill_4_range": req.body.skill_4_range,
        },
      }
    );

    var updateddata = await signUp.find({ Email: req.body.userEmail });
    // fs.unlink(path.join(path.dirname(__dirname),'uploads/',req.file.filename),(err)=>{
    //   if(err){
    //       throw err;
    //   }
    // });
    res.render("resume", { bioData: updateddata });
  }catch(e){
    res.redirect("resume");
    
  }
});  

app.post("/signup", async (req, res) => {
  try {
    const signupUser = new signUp({
      Email: req.body.Email,
      Password: req.body.Password,
    });

    const tokens = await signupUser.genrateAuthToken();

    const signupUserData = await signupUser.save();

    res.cookie("loginSignupToken", tokens, {
      expires: new Date(Date.now() + 600000),
      httpOnly: true,
    });
    let usersignupemail = req.body.Email;
    var updateddata = await signUp.find({ Email: req.body.Email });

    res.status(201).render("form", { bioData: updateddata });
  } catch (error) {
   
    res.status(400).render("loginSignup");
  }
});
app.post("/login", async (req, res) => {
  try {
    res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate,post-check=0, pre-check=0"
    );

    const Email = await req.body.Email;

    const Password = req.body.Password;

    const userEmail = await signUp.findOne({ Email: Email });
    
    const isMatch = await bcrypt.compare(Password, userEmail.Password);

    if (isMatch) {
      const tokens = await userEmail.genrateAuthToken();

      res.cookie("loginSignupToken", tokens, {
        expires: new Date(Date.now() + 600000),
        httpOnly: true,
      });

    
      var updateddata = await signUp.find({ Email: Email });
      

      res.status(201).render("form", { bioData: updateddata });
      // res.status(201).redirect("form", { bioData: updateddata });
    } else {
     
      res.render("loginSignup");
      // res.redirect("loginSignup");
    }
  } catch (error) {
    res.status(400).send(error);
    res.render("loginSignup");
  }
});

app.get("/logout", auth, async (req, res) => {
  try {
    req.userdata.tokens = req.userdata.tokens.filter((currenttoken) => {
      return currenttoken.token !== req.usertoken;
    });
    res.clearCookie("loginSignupToken");
    await req.userdata.save();
    res.render("loginSignup");
  } catch (error) {
    res.status(500).send(error);
  }
});
