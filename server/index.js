require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const ClientError = require('./client-error');

const pg = require('pg');

const db = new pg.Pool({
  connectionString: 'postgresql://dev:dev@localhost/fuzeChat',
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
const jsonMiddleWare = express.json();

app.use(staticMiddleware);
app.use(jsonMiddleWare);

app.get('/api/users', (req, res, next) => {
  const sql = `
    select *
    from "users"
  `;

  db.query(sql)
    .then(result => {
      const usersList = result.rows;
      res.json(usersList);
    })
    .catch(err => next(err));
});

// GET REQUEST FOR CHATROOMS
app.get('/api/chatRooms', (req, res, next) => {
  const sql = `
    select *
    from "chatRooms"
  `;

  db.query(sql)
    .then(result => {
      const roomsList = result.rows;
      res.json(roomsList);
    })
    .catch(err => next(err));
});

// TEST
// GET REQUEST FOR USERSINCHAT
app.get('/api/usersInChat', (req, res, next) => {
  const { chatRoomName } = req.body;

  const sqlRoom = `
      with "cte_chatRoom" as (
      select "chatRoomId"
        from "chatRooms"
       where "chatRoomName" = $1
    )

    select * from "cte_chatRoom";
  `;

  const sqlName = `
    with "cte_userId" as (
      select "userId"
        from "users"
       where "userName" = $2
    )

    select * from "cte_userId";
  `;

  const sql = `
    with "cte_chatRoom" as (
    select "chatRoomId"
      from "chatRooms"
      where "chatRoomName" = $1
    )

    select * from "cte_chatRoom";

    insert into "usersInChat" ("chatRoomId")
    values (${sqlRoom}, ${sqlName})

  `;

  const params = [chatRoomName];

  db.query(sql, params)
    .then(result => {
      const activeUsers = result.rows;
      res.json(activeUsers);
    })
    .catch(err => next(err));
});
// TEST ABOVE

app.post('/api/users', (req, res, next) => {
  const { userName } = req.body;

  if (!userName) {
    throw new ClientError(400, 'Invalid input');
  } else if (userName.length < 7 && userName.length >= 1) {
    throw new ClientError(400, 'Invalid input');
  }

  const sql = `
    insert into "users" ("userName", "createdAt")
    values ($1, CURRENT_TIMESTAMP)
    returning *
  `;

  const params = [userName];

  db.query(sql, params)
    .then(result => {
      const newUser = result.rows[0];
      res.status(201).json(newUser);
    })
    .catch(err => next(err));

});

// POST REQUEST FOR ROOM SELECTION
app.post('/api/usersInChat', (req, res, next) => {
  const { chatRoomName, userName } = req.body;

  if (!chatRoomName || !userName) {
    throw new ClientError(400, 'Invalid input!');
  }

  // SQL QUERY
  const sql = `
 insert into "usersInChat" ("chatRoomId", "userId")
  values (
    (select "chatRoomId" from "chatRooms" where "chatRoomName" = $1),
    (select "userId" from "users" where "userName" = $2)
  )
  returning *
  `;

  const params = [chatRoomName, userName];

  db.query(sql, params)
    .then(result => {
      const active = result.rows[0];
      res.status(201).json(active);
    })
    .catch(err => next(err));

});

app.use(errorMiddleware);

// ADDING A DELETE REQUEST

app.delete('/api/users/:userId', (req, res, next) => {
  const id = Number(req.params.userId);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      error: 'Invalid input'
    });
  } else {
    const sql = `
      delete
        from "users"
       where "userId" = $1
       returning *
    `;

    const params = [id];

    db.query(sql, params)
      .then(result => {
        const user = result.rows[0];

        if (!user) {
          res.status(404).json({
            error: 'Invalid input'
          });
        } else {
          res.status(204).json(user);
        }
      })
      .catch(err => next(err));
  }

});

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
