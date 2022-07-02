Tale Weaver App
=========
## Getting Started / Installation

1. git clone the repo to you local directory: `git clone <repo>`
2. Install dependencies using: `npm i`
3. Fix to binaries for sass: `npm rebuild node-sass`
4. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`

## Overview
The goal of this projet was to build a minimal and functional app where users can create, read and contribute to stories. Authors of the stories are able to accept user contributions to be added to a continuing story or mark it as complete. Users can also vote on contributions that they like.

## Usage
This project is more for learning purposes, it is not intended for any sorts of production deployment.
## Tech Stack
We have developed a minimal fullstack application using the following:
- Frontend: HTML, CSS, EJS, JS
- Backend: NodeJS
- Database: Postgres

## Final Product
Following is how our final product looks like. 

A screenshot of the login page: ![Tale Weaver login page: ](https://github.com/bbashcode/story-creator/blob/master/docs/login.png)

A screenshot of the homepage: ![Tale Weaver homepage: ](https://github.com/bbashcode/story-creator/blob/master/docs/homepage_new.png)

A screenshot of the single story page: ![Tale Weaver single story page: ](https://github.com/bbashcode/story-creator/blob/master/docs/single_story.png)

A screenshot of the start a story page: ![Tale Weaver start a story page: ](https://github.com/bbashcode/story-creator/blob/master/docs/start_a_story.png)

A screenshot of the vote accept page: ![Tale Weaver vote accept page: ](https://github.com/bbashcode/story-creator/blob/master/docs/vote_accept.png)

A screenshot of the contribute page: ![Tale Weaver contribute page: ](https://github.com/bbashcode/story-creator/blob/master/docs/contribute.png)

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- "body-parser": "^1.19.0",
- "chalk": "^2.4.2",
- "cookie-session": "^2.0.0",
- "dotenv": "^2.0.0",
- "ejs": "^3.1.8",
- "express": "^4.18.1",
- "morgan": "^1.9.1",
- "pg": "^8.5.0",
- "sass": "^1.35.1"


