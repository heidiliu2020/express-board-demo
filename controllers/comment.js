// 從 models 引入 db
const db = require('../models');
const Comment = db.Comment;
const User = db.User;

const commentController = {
  add: (req, res, next) => {
    const {userId} = req.session
    const {content} = req.body
    if (!userId) {
      req.flash('errorMessage', '請先登入');
      return next();
    }
    if (!content) {
      req.flash('errorMessage', '請填入留言內容');
      return next();
    }

    Comment.create({
      content,
      UserId: userId
    }).then(() => {
      res.redirect('/');
    })
  },

  index: (req, res) => {
    Comment.findAll({
      // 撈取資料需要關聯 Comment 和 User table
      include: User
    }).then(comments => {
      res.render('index', {
        comments
      });
    });
  },

  delete: (req, res) => {
    Comment.findOne({
      where: {
        id: req.params.id,
        UserId: req.session.userId
      }
    }).then(comment => {
      return comment.destroy();
    }).then(() => {
      res.redirect('/');
    }).catch(() => {
      res.redirect('/');
    });
  },

  update: (req, res) => {
    Comment.findOne({
      where: {
        id: req.params.id
      }
    }).then(comment => {
      res.render('update', {
        comment
      });
    });
  },

  handleUpdate: (req, res) => {
    Comment.findOne({
      where: {
        id: req.params.id,
        UserId: req.session.userId
      }
    }).then(comment => {
      return comment.update({
        content: req.body.content
      });
    }).then(() => {
      res.redirect('/');
    }).catch(() => {
      res.redirect('/');
    });
  }
}

module.exports = commentController;
