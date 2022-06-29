//This file will contain routes /stories, /stories/my_stories, /stories/create, /stories/:id, /stories/:id/contributions

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //ROOT DIRECTORY SENDS TO HOME
  router.get("/", (req, res) => {
    const userId = req.session.user_id;
    if (!userId) {
      console.log(userId);
      res.send({ message: "not logged in" });
      return;
    }

    Promise.all([
      db.query(`SELECT * FROM users WHERE id = $1;`, [userId]),
      db.query(
        `SELECT stories.*, users.username AS author FROM stories JOIN users ON stories.creator_id = users.id ORDER BY created_at;`
      ),
    ]).then((values) => {
      if (values[0].rows === 0) {
        res.send({ error: "no user with that id" });
        return;
      }
      const templateVars = { user: values[0].rows[0], stories: values[1].rows };
      console.log("test template vars", templateVars);
      res.render("home", templateVars);
    });
  });
  // MY STORIES PAGE - Page Filters and Displays Pages made by user
  /////////////////////////////////
  router.get("/my_stories", (req, res) => {
    const userId = req.session.user_id;
    if (!userId) {
      console.log(userId);
      res.send({ message: "not logged in" });
      return;
    }

    Promise.all([
      db.query(`SELECT * FROM users WHERE id = $1;`, [userId]),
      db.query(`SELECT * FROM stories WHERE creator_id = $1;`, [userId]),
    ]).then((values) => {
      if (values[0].rows === 0) {
        res.send({
          error: "no user with that id",
        });
        return;
      }
      const templateVars = { user: values[0].rows[0], stories: values[1].rows };
      res.render("mystories", templateVars);
    });
  });

  //CREATE A STORY PAGE - User can start and give a title to a new story
  /////////////////////////////////////////////////////
  router.get("/create", (req, res) => {
    const userId = req.session.user_id;
    if (!userId) {
      console.log(userId);
      res.send({ message: "not logged in" });
      return;
    }

    db.query(`SELECT * FROM users WHERE id = $1;`, [userId]).then((data) => {
      if (data.rows.length === 0) {
        res.send({ error: "no user with that id" });
        return;
      }
      const templateVars = { user: data.rows[0] };
      res.render("create", templateVars);
    });
  });
  //SHOWS A SPECIFIC STORY - Full Current Story with the starter text and all the chronilogical accepted submissions - links to vote and make contribution
  ////////////////////////////////////
  router.get("/:story_id", (req, res) => {
    const userId = req.session.user_id;
    const storyId = req.params.story_id;
    if (!userId) {
      console.log(userId);
      res.send({ message: "not logged in" });
      return;

    }

    Promise.all([
      db.query(`SELECT * FROM users WHERE id = $1;`, [userId]),
      db.query(`SELECT intro_text, creator_id FROM stories WHERE id = $1;`, [
        storyId,
      ]),
      db.query(
        `SELECT contribution FROM CONTRIBUTIONS WHERE story_id = $1 AND status = 'selected' ORDER BY created_at`,
        [storyId]
      ),
      db.query(`SELECT title, id, creator_id, active_status FROM stories WHERE id = $1;`, [storyId]),
    ]).then((values) => {
      console.log("values", values);

      const templateVars = {
        user: values[0].rows[0],
        start: values[1].rows[0].intro_text,
        contributions: values[2].rows,
        title: values[3].rows[0],
        owner: userId === values[1].rows[0].creator_id,
      };
      console.log("vars", templateVars);
      res.render("singleStory", templateVars);


    });
  });
  //VOTING PAGE - Displays vote for general users, and an accpet button for the author of the story
  //votes are sent to votes table from a generic user and and author accept flags selected contribution as 'accepted' and all others as 'rejected'
  ////////////////////////////////////

  router.get("/:story_id/vote", (req, res) => {
    const userId = req.session.user_id;
    const storyId = req.params.story_id;
    if (!userId) {
      console.log(userId);
      res.send({ message: "not logged in" });
      return;
    }
    Promise.all([
      db.query(`SELECT * FROM users WHERE id = $1;`, [userId]),
      db.query(
        `SELECT contributions.contribution AS contribution, contributions.id AS contribution_id, status, created_at, users.username AS username, contributions.story_id AS story_id FROM contributions JOIN users ON contributor_id = users.id WHERE story_id = $1 AND status = 'pending';`,
        [storyId]
      ),
      db.query(
        `SELECT COUNT(votes.id), votes.contribution_id FROM votes JOIN contributions ON contribution_id = contributions.id WHERE contributions.story_id = ${storyId} GROUP BY contribution_id`
      ),
      db.query(`SELECT creator_id FROM stories WHERE id = $1;`, [storyId]),
    ]).then((values) => {
      console.log("values", values);

      const templateVars = {
        user: values[0].rows[0],
        contributions: values[1].rows,
        votes: values[2].rows,
        owner: userId == values[3].rows[0].creator_id,
      };

      console.log("vars", templateVars);
      res.render("userVotes", templateVars);
    });
  });
  //POST FROM GENERIC USER VOTING PAGE - tallies a vote
  /////////////////////////////////////
  router.post("/:story_id/vote/:contribution_id", (req, res) => {
    const userId = req.session.user_id;
    const storyId = req.params.story_id;
    const contId = req.params.contribution_id;

    db.query(
      `INSERT INTO votes (voter_id, contribution_id)
    VALUES($1, $2) RETURNING *;`,
      [userId, contId]
    )
      .then(() => {
        res.redirect(`/stories/${storyId}`);
      })
      .catch((err) => console.log("Error", err));
  });
  //POST FROM CREATOR USER VOTING PAGE
  //updates status of selected and unselected contributions from 'pending' to 'selected' and 'rejected'
  /////////////////////////////////////
  router.post("/:story_id/accept/:contribution_id", (req, res) => {
    const userId = req.session.user_id;
    const storyId = req.params.story_id;
    const contId = req.params.contribution_id;

    db.query(
      `UPDATE contributions
      SET status = 'selected'
      WHERE id = $1`,
      [contId]
    )
      .then(() => {
        db.query(
          `UPDATE contributions
          SET status = 'reject'
          WHERE story_id = $1
          AND status = 'pending'`,
          [storyId]
        );
        res.redirect(`/stories/${storyId}`);
      })
      .catch((err) => console.log("Error", err));
  });
  //SUBMIT A CONTRIBUTION TO AN ONGOING STORY PAGE
  ////////////////////////////////////
  router.get("/:story_id/contribute", (req, res) => {
    const userId = req.session.user_id;
    const storyId = req.params.story_id;
    if (!userId) {
      console.log(userId);
      res.send({ message: "not logged in" });
      return;
    }

    Promise.all([
      db.query(`SELECT * FROM users WHERE id = $1;`, [userId]),
      db.query(`SELECT title, id FROM stories WHERE id = $1;`, [storyId]),
    ]).then((values) => {
      console.log("values", values);

      const templateVars = {
        user: values[0].rows[0],
        title: values[1].rows[0],
      };
      console.log("vars", templateVars);
      res.render("contribute", templateVars);
    });
  });
  //POST CONTRIBUTION TEXT to contributions table
  ///////////////////////////////
  router.post("/:story_id/contribute", (req, res) => {
    const userId = req.session.user_id;
    const storyId = req.params.story_id;

    db.query(
      `INSERT INTO contributions (contributor_id, story_id, contribution)
  VALUES($1, $2, $3) RETURNING *;`,
      [userId, storyId, req.body.contribution]
    )
      .then(() => {
        res.redirect(`/stories/${storyId}`);
      })
      .catch((err) => console.log("Error", err));
  });
  //POST CREATION TITLE AND TEXT to stories table
  ////////////////////////////////////
  //POST ROUTE FOR STORY COMPLETION
  router.post("/:story_id/complete", (req, res) => {
    //const userId = req.session.user_id;
    const storyId = req.params.story_id


    db.query(`UPDATE stories SET active_status = FALSE
    WHERE id = $1 RETURNING *;`, [storyId])
      .then(() => {
        res.redirect(req.get('referer'));

      }).catch(err => console.log("Error", err))

  });
  ///////////////////////////////////
  router.post("/create", (req, res) => {
    const userId = req.session.user_id;

    db.query(
      `INSERT INTO stories (creator_id, title, intro_text)
    VALUES($1, $2, $3) RETURNING *;`,
      [userId, req.body.Title, req.body.TextIntro]
    )
      .then(() => {
        res.redirect("/stories/my_stories");
      })
      .catch((err) => console.log("Error", err));
  });
//////////////////////////////////////

  return router;
};
