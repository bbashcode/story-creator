//This file will contain routes for /(home page), /login, /logout, /register

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
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
        res.render('home', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
