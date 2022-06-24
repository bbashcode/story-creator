## Requirements:
- authorized users can start a story
- users can add contributions to an existing story
- users can upvote a contribution
- users can see upvotes of a contribution
- creator of story can accept a contribution; this merges it to the rest of the story
- creator of a story can mark the story completed
- users can view a list of stories on the homepage along with their status e.g. in progress or completed
- users cannot add to a completed story
- users can read a story



>>> BREAD 


Browse
Read
Edit
Add 
Delete


## User Stories: (Core)
- As an authorized user, I can start a story
  - Acceptance Criteria: 
    - Create a form for users to start a story
    - Form should have following fields: title, progressStatus: active by default, completed, introText
    - A GET route to fetch the form (/create), a POST route to post it to the DB (maybe a button that says new story)
    - Route(/create)


- As an user, I can add contributions to an existing story
  - Acceptance Criteria: 
    - Add a continue button at the bottom of active story which will give the user same create form
    - On submit, save it to DB and load it to the end of that specified story
    - Route( /stories/:id)

- As an user, I can upvote a contribution
  - Acceptance Criteria: 
  - Add an upvpote icon (maybe heart? icon) for each story that would turn red in upvote
  - Save the upvote to the database?
  - Save user name(voter_id), contribution id to the database


- As an user, I can see upvotes of a contribution
  - AC:
    - When hovering over the upvite icon, show the number of upvotes


- As a creator of story, I can accept a contribution; this merges it to the rest of the   story
  - AC:
    - When there is a contribution to the story, the creator can accept 


- As a creator of a story, I can mark the story completed
  - AC:
    - A creator of the story 
    - 
- As an user, I can view a list of stories on the homepage along with their status e.g. in progress or completed
- As a user, I CANNOT add to a completed story
- As a user, I can read a story

### Additional Stories (Possible Stretch Features):
- As a user, I can search for stories
- As a creator, I can give a title to a story
- 





