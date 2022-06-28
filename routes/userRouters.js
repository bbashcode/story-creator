//This file will contain routes for /(home page), /login, /logout, /register

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const userId = req.session.user_id;
    if (!userId) {
      console.log(userId);
      res.send({message: "not logged in"});
      return;
    };

   Promise.all([db.query(`SELECT * FROM users WHERE id = $1;`, [userId]), db.query(`SELECT stories.*, users.username AS author FROM stories JOIN users ON stories.creator_id = users.id ORDER BY created_at;`)])
      .then((values) => {
          if(values[0].rows === 0) {
            res.send({error: "no user with that id"});
            return;
            }
            const templateVars = {user: values[0].rows[0], stories: values[1].rows};
            res.render('home', templateVars);
        })
  });
///////////////

  return router;
};
