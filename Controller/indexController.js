const admin = require("../model/admin_model");
const movie = require("../model/movies_model");
const movie_mall = require("../model/moviemall_model");
const user = require("../model/user_model");
const bcrypt = require("bcrypt");
const plan = require("../model/movie_plan");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const pdf = require('html-pdf');
const ejs = require('ejs')
module.exports.dashboardSession = (req, res) => {
  req.flash("success", "Login Successfully");
  // res.render('dashboard')
  return res.redirect("/admin_panel");
};
module.exports.homePage = async (req, res) => {
  const movieData = await movie.find({}).limit(4);
  res.render("home", {
    movie: movieData,
  });
};
module.exports.dashboard = (req, res) => {
  res.render("dashboard");
};
module.exports.register = (req, res) => {
  res.render("register");
};
module.exports.registration = async (req, res) => {
  const adminData = await admin.findOne({ email: req.body.email });
  if (adminData) {
    req.flash("error", "Account Already Registered");
    console.log("Already register");
    return res.redirect("/register");
  }
  else {
    var Admin_password = await bcrypt.hash(req.body.password, 10);
    req.body.password = Admin_password;
    req.body.gender = "null";
    req.body.age = "null";
    req.body.city = "null";
    req.body.avatar = "";
    await admin.create(req.body);
    return res.redirect("/login");
  }
};
module.exports.login = (req, res) => {
  return res.render("login");
};
module.exports.forgotpassword = (req, res) => {
  return res.render("forgot_password");
};
module.exports.checkemail = async (req, res) => {
  var adminData = await admin.findOne({ email: req.body.email });
  if (adminData) {
    var otp = Math.ceil(Math.random() * 100000);
    var transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "utsavgarchar63@gmail.com",
        pass: "vpkijswtrojqffix",
      },
    });
    let info = transport.sendMail({
      from: "utsavgarchar63@gmail.com",
      to: adminData.email,
      subject: "testing",
      text: "Hello",
      html: `<b>otp:${otp}</b>`,
    });
    res.cookie("otp", otp);
    res.cookie("email", adminData.email);
    return res.redirect("/checkotp");
  } else {
    req.flash("error", "Email not found !");
    console.log("Email not found");
    return res.redirect("back");
  }
};
module.exports.checkotp = (req, res) => {
  res.render("checkotp");
};
module.exports.newpassword = (req, res) => {
  return res.render("newpassword");
};
module.exports.checkOtp = (req, res) => {
  if (req.cookies.otp == req.body.otp) {
    return res.redirect("/newpassword");
  } else {
    req.flash("error", "OTP not Match !");
    return res.redirect("back");
  }
};
module.exports.lostpassword = async (req, res) => {
  if (req.body.password == req.body.cpassword) {
    const adminEmail = await admin.findOne({ email: req.cookies.email });
    if (adminEmail) {
      var pass = await bcrypt.hash(req.body.password, 10);
      const admindata = await admin.findByIdAndUpdate(adminEmail.id, {
        password: pass,
      });
      console.log("Password changed successfully");
      res.cookie("otp", "");
      res.cookie("email", "");
      return res.redirect("/logout");
    }
  } else {
    req.flash("error", "New Password and Confirm Password Not Match");
    console.log("Password not match");
    return res.redirect("/newpassword");
  }
};
module.exports.changepassword = (req, res) => {
  res.render("changepassword");
};
module.exports.editpassword = async (req, res) => {
  let incr_oldpass = req.user.password;
  let oldpass = req.body.oldpass;
  let npass = req.body.npass;
  let conf_pass = req.body.cpass;
  let decryptedPass = await bcrypt.compare(oldpass, incr_oldpass);
  
  if (decryptedPass == true) {
    if (oldpass != npass) {
      if (npass == conf_pass) {
        let Admin_password = await bcrypt.hash(conf_pass, 10);
        const admindata = await admin.findByIdAndUpdate(req.user.id, {
          password: Admin_password,
        });
        if (admindata) {
          console.log("Password changed successfully");
          return res.redirect("/logout");
        }
      } else {
        req.flash("error", "New & Confirm Password not match");
        return res.redirect("back");
      }
    } else {
      req.flash("error", "Current & New Password are match.");
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Enter valid Old Password");
    return res.redirect("back");
  }
};
module.exports.profile = (req, res) => {
  res.render("profile");
};
module.exports.updateprofile = async (req, res) => {
  const profiledata = await admin.findById(req.params.id);
  if (profiledata) {
    return res.render("update_Profile", {
      p_data: profiledata,
    });
  }
};
module.exports.editprofile = async (req, res) => {
  if (req.file) {
    const admindata = await admin.findById(req.body.Id);
    if (admindata.avatar) {
      fs.unlinkSync(path.join(__dirname, "..", admindata.avatar));
    }
    let imagepath = (await admin.avatar_path) + "/" + req.file.filename;
    await admin.findByIdAndUpdate(req.body.Id, {
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      city: req.body.city,
      age: req.body.age,
      avatar: imagepath,
    });
    return res.redirect("/profile");
  } else {
    const admin_data = await admin.findById(req.body.Id);
    if (admin_data.avatar) {
      var imgPath = admin_data.avatar;
    }
    await admin.findByIdAndUpdate(req.body.Id, {
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      city: req.body.city,
      age: req.body.age,
      avatar: imgPath,
    });
    return res.redirect("/profile");
  }
};
module.exports.movie_detail = async (req, res) => {
  const movieData = await movie.findById(req.params.id);
  return res.render("movie_detail", {
    detail: movieData,
  });
};
module.exports.book_now = async (req, res) => {
  const movieData = await movie.findById(req.params.id);
  const planData = await plan
    .find({ movieId: req.params.id })
    .populate("movieId")
    .populate("mallId")
    .exec();
  const movie_mallData = await movie_mall
    .findOne({ movieId: req.params.id })
    .populate("movieId")
    .populate("mallId");
  res.render("book_ticket", {
    movie: movieData,
    plan: planData,
    movie_mall: movie_mallData,
  });
};
module.exports.book_show = async (req, res) => {
  const planData = await plan
    .findById(req.params.id)
    .populate("movieId")
    .exec();

  res.render("bookShow", {
    show: planData,
  });
};
module.exports.book_sheets = async (req, res) => {
  req.body.password = "null";
  const bookSheets = await user.create(req.body);
  if (bookSheets) {
    res.cookie('ticket', bookSheets);
    const userEmail = [bookSheets.email]
    res.cookie('email', userEmail)
    return res.render('booked');
  }

};
module.exports.ticket = async (req, res) => {
  const date_ = new Date();
  const day = ("0" + date_.getDate()).slice(-2);
  const month = ("0" + (date_.getMonth() + 1)).slice(-2);
  const year = date_.getFullYear();
  const date = day + "-" + month + "-" + year;
  const plan_ = await plan
    .findById(req.cookies.ticket.planId)
    .populate("movieId")
    .populate("mallId")
    .exec();
  const movie_ = await movie.findById(plan_.movieId.id);
  const ticket_ = await req.cookies.ticket;
  res.render("ticket", {
    date: date,
    ticket_: ticket_,
    plan: plan_,
    movie: movie_,
  });
};
module.exports.viewUser = async (req, res) => {
  const userData = await user.find({}).populate("planId").exec();
  const planData = await plan
    .find({})
    .populate("mallId")
    .populate("movieId")
    .exec();
  res.render("viewUser", {
    user: userData,
    plan: planData,
  });
};
module.exports.deleteUser = async (req, res) => {
  const userData = await user.findByIdAndDelete(req.params.id);
  req.flash("success", "User deleted successfully");
  res.redirect("back");
};
module.exports.sendMail = async (req, res) => {
  const date_ = new Date();
  const day = ("0" + date_.getDate()).slice(-2);
  const month = ("0" + (date_.getMonth() + 1)).slice(-2);
  const year = date_.getFullYear();
  const date = day + "-" + month + "-" + year;
  const plan_ = await plan
    .findById(req.cookies.ticket.planId)
    .populate("movieId")
    .populate("mallId")
    .exec();
  const movie_ = await movie.findById(plan_.movieId.id);
  const ticket_ = await req.cookies.ticket;


  if (req.cookies.email[0]) {
    const templatePath = 'Views/ticket.ejs'
    const data = {
      date: date,
      ticket_: ticket_,
      plan: plan_,
      movie: movie_,
    }
  
    ejs.renderFile(templatePath, data, (err, html) => {
      if (err) {
        console.log(err)
        console.log(html)
      }
      const pdfOptions = {
        format: 'Letter',
        border: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        }
      };

      pdf.create(html,pdfOptions).toBuffer((err, buffer) => {
        if (err) {
          console.log(err)
        }
        var transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "utsavgarchar63@gmail.com",
            pass: "vpkijswtrojqffix",
          },
        });
        let info = transport.sendMail({
          from: "utsavgarchar63@gmail.com",
          to: req.cookies.email[0],
          subject: "ENTERTAIN CINEMA PRESENTS",
          text: "Your Movie Ticket",
          attachments: [{
            filename: 'Movie Ticket.pdf',
            content: buffer,
            contentType: 'application/pdf'
          }],
        });
      });
      
    });

    res.cookie("email", '');
    res.cookie("ticket", '');
    return res.redirect("/");
  } else {
    res.cookie("email", '');
    res.cookie("ticket", '');
    return res.redirect("/");
  }
}