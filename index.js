const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
const port = process.env.PORT || 5002; // 判斷是否指定環境變數

const userController = require("./controllers/user");
const commentController = require("./controllers/comment");

const moment = require("moment");
const shortDateFormat = "YYYY-MM-DD HH:mm:ss";
app.locals.moment = moment;
app.locals.shortDateFormat = shortDateFormat;

app.set("view engine", "ejs");
// 在 app.js 中設定載入模組 express-session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());

// 透過 locals 傳值: session 功能和 errorMessage
app.use((req, res, next) => {
  // 有 username 代表有登入狀態
  res.locals.username = req.session.username;
  res.locals.errorMessage = req.flash("errorMessage");
  next();
});

app.get("/", commentController.index);

function redirectBack(req, res, next) {
  res.redirect("back");
}

app.get("/register", userController.register);
app.post("/register", userController.handleRegister, redirectBack);
app.get("/login", userController.login);
app.post("/login", userController.handleLogin, redirectBack);
app.get("/logout", userController.logout);

app.post("/comments", commentController.add, redirectBack);
app.get("/delete_comments/:id", commentController.delete);
// 讀取要編輯的 comment
app.get("/update_comments/:id", commentController.update);
// 執行修改 comment
app.post("/update_comments/:id", commentController.handleUpdate);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
