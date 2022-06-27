/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

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
        const users = data.rows[0];
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
