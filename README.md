# Express Board - 簡易留言板

這是使用 Express 和 Sequelize 後端技術開發的留言板，並部署在 Heroku 平台。

[DEMO](https://express-board-demo.herokuapp.com/)

![](https://i.imgur.com/shOz2Ey.png)

## 搭配第三方套件在 Node.js 上實作 MVC 架構：

- 以 EJS 作為 template engines，搭配 bootstrap 實作 View
- 使用 bcrypt 將密碼加密後存入資料庫
- 使用 body-parser 解析 HTTP Request
- 使用 express-session 管理 session 以實現登入機制
- 使用 connect-flash 顯示錯誤訊息
- 使用 Heroku 提供的 ClearDB MySQL 串接資料庫
