const express = require('express');
const cors = require('cors');
const app = express();
const trickData = require('./dog-tricks');

app.use(cors());
app.use(express.json());
app.set('port', process.env.PORT || 3001);

app.locals.title = 'Dog Tricks API';
app.locals.dogTricks = trickData;

app.get('/api/v1/dog-tricks', (req, res) => {
  const tricks = app.locals.dogTricks;
  res.send({ tricks });
});

app.get('/api/v1/dog-tricks/:id', (req, res) => {
  const trick = app.locals.dogTricks.find(trick => trick.id === req.params.id);
  trick ? res.status(200).json({ trick }) : res.sendStatus(404);
});

app.get('/api/v1/dog-tricks/search', (req, res) => {
  const name = req.query;
  const filteredResults = app.locals.dogTricks.filter(trick => trick.name.includes(name));
  name ? res.json(filteredResults) : res.status(400).json();
})

app.post('/api/v1/dog-tricks', (req, res) => {
  const id = Date.now();
  const trick = req.body;
  for (let requiredParam of ['name', 'difficulty', 'tutorial']) {
    if (!trick[requiredParam]) {
      res.status(422).send({
        error: `Expected format: { name: <String>, difficulty: <String>, tutorial: <String> }. 
        You're missing a "${requiredParam}" property.`
      });
      return;
    }
  }
  const { name, difficulty, tutorial } = trick;
  app.locals.dogTricks.push({ id, name, difficulty, tutorial });
  res.status(201).json({ id, name, difficulty, tutorial });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});
