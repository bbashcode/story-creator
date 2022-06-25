//This file will contain routes /stories/my_stories, /stories/create, /stories/:id, /stories/:id/contributions

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/my_stories", (req, res) => {
    const userId = req.session.user_id;
    if (!userId) {
      console.log(userId)
      res.send({message: "not logged in"});
      return;
    };

  Promise.all([db.query(`SELECT * FROM users WHERE id = $1;`, [userId]), db.query(`SELECT * FROM stories WHERE creator_id = $1;`, [userId])])
  .then((values) => {
    if (values[0].rows === 0) {
      res.send({
        error: "no user with that id"
      });
      return;
    }
    const templateVars = {user: values[0].rows[0],stories: values[1].rows};
    res.render('mystories', templateVars);
   })
  });
/////////////////////////////////////////////////////
  router.get("/create", (req, res) => {
    const userId = req.session.user_id;
    if (!userId) {
      console.log(userId)
      res.send({message: "not logged in"});
      return;
    };

    db.query(`SELECT * FROM users WHERE id = $1;`, [userId])
      .then(data => {
          if(data.rows.length === 0) {
          res.send({error: "no user with that id"});
          return;
         }
        const templateVars =  { user: data.rows[0] };
        res.render('create', templateVars);
      })

  });
  ////////////////////////////////////
  router.post("/create", (req, res) => {
    const userId = req.session.user_id;


    db.query(`INSERT INTO stories (creator_id, title, intro_text)
    VALUES($1, $2, $3) RETURNING *;`, [userId, req.body.Title, req.body.TextIntro])
      .then(() => {
        res.redirect('/stories/my_stories')

      }).catch(err => console.log("Error", err))

  });

  return router;
};
