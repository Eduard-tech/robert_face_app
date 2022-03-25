const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express ();
const knex = require('knex');

 const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'Smitesmite1',
      database : 'smart-brain'
    }
  });


app.use(bodyParser.json())
app.use(cors())

const database = {
    users: [
        {
            id: '123',
            name: 'Ion',
            email: 'ion@gmail.com',
            password: 'visine',
            entries: 0,
            joined: new Date()
        },

        {
            id: '124',
            name: 'Roni',
            email: 'roni@gmail.com',
            passwords: 'capsuni',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            has: '',
            email: 'ion@gmail.com'
        }
    ]
}

app.get('/', (req, res)=> {
    res.send(database.users);
})

app.post('/signin', (req, res)=> {
if (req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password) {
        res.json('succes'); } else {
            res.status(400).json('erroare la logare')
        }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    db('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        joined: new Date()
    }).then(user => {
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('Unable to register'))
})

app.get('/profile/:id', (req, res)=> {
    const { id } = req.params;
    db.select('*').from('users').where({id}).then(user => {
        if (user.length) {
        res.json(user[0])
        } else {
            res.status(400).json('Not found')
        }
    })
    .catch(err => res.status(400).json('Error getting user'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
})

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3000, ()=> {
    console.log('merge')
})

/*
/ --> res = merge app get
/signin --> post = succes/fail
/register --> post = user
/profile/:userid --> get = user
/image --> put --> user 

*/