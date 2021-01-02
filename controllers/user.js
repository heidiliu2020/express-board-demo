const bcrypt = require('bcrypt');
const saltRounds = 10;
// 從 models 引入 db
const db = require('../models');
const User = db.User;

const userController = {
  register: (req, res) => {
    res.render('user/register');
  },

  handleRegister: (req, res, next) => {
    const {username, password, nickname} = req.body;
    if (!username || !password || !nickname) {
      req.flash('errorMessage', '缺少必要欄位');
      return next();
    }

    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        req.flash('errorMessage', err.toString());
        return next();
      }
      // 在 User table 建立資料
      User.create({
        username,
        nickname,
        password: hash
      }).then(user => {     // create 完會回傳一個 instance
        req.session.username = username;
        // 在 session 中加入 user.id
        req.session.userId = user.id;
        res.redirect('/');

      // 有錯誤的話就印出錯誤訊息
      }).catch(err => {
        req.flash('errorMessage', '已存在相同用戶名');
        return next();
      });
    });
  },

  login: (req, res) => {
    res.render('user/login')
  },

  handleLogin: (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      req.flash('errorMessage', '請輸入您的帳密');
      return next();
    }

    // 從 User table 撈取對應 username 的資料
    User.findOne({
      where: {
        username
      }
    }).then(user => {
      if (!user) {
        req.flash('errorMessage', '使用者不存在');
        return next();
      }

      bcrypt.compare(password, user.password, function (err, isSccess) {
        if (err || !isSccess) {
          req.flash('errorMessage', '輸入帳密有誤');
          return next();
        }
        req.session.username = user.username;
        // 在 session 中加入 user.id
        req.session.userId = user.id;
        res.redirect('/')
      });
    // 有錯誤的話就印出錯誤訊息
    }).catch(err => {
      req.flash('errorMessage', err.toString());
      return next();
    });
  },

  logout: (req, res) => {
    req.session.username = null;
    res.redirect('/');
  }
}

module.exports = userController;
