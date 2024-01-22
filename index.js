const express = require('express');
const app = express();
app.use(express.json()); // для поддержки JSON-encoded тел запросов

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const mongoose = require('mongoose');
const redis = require('redis');

// MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });

// Redis
const redisClient = redis.createClient({ host: 'localhost', port: 6379 });
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();


const User = require('./userModel');

app.get('/hello', async (req, res) => {
  return res.send("<h1>Hello!</h1>");
});

app.get('/load', (req, res) => {
//    console.log(req.query);
//    console.log(req.query.cpuTime);
//    console.log(req.query.sleepTime);
    const cpuTime = parseInt(req.query.cpuTime, 10); // CPU time in milliseconds
    const sleepTime = parseInt(req.query.sleepTime, 10); // Sleep time in milliseconds

    if (isNaN(cpuTime) || isNaN(sleepTime)) {
        return res.status(400).send('Invalid parameters');
    }

    // CPU load and usleep implementation
    const startUsage = process.cpuUsage();
    const startTime = Date.now();

    // Simulate CPU load
    while (Date.now() - startTime < cpuTime) {
        // Intensive computation
    }

    const endUsage = process.cpuUsage(startUsage);

    // Sleep
    setTimeout(() => {
        const cpuUsage = endUsage.user + endUsage.system;
        res.send(`CPU time: ${cpuUsage} microseconds, Sleep time: ${sleepTime} milliseconds`);
    }, sleepTime);
});

// Получение пользователя
app.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  // Проверка кеша
  const cachedUser = await redisClient.get(username);
  if (cachedUser) {
    return res.json({ source: 'cache', data: JSON.parse(cachedUser) });
  }
  
  // Если нет в кеше, ищем в MongoDB
  const user = await User.findOne({ username });
  if (user) {
    await redisClient.set(username, JSON.stringify(user));
    return res.json({ source: 'db', data: user });
  }

  res.status(404).send('User not found');
});

// Сохранение пользователя
app.post('/user', async (req, res) => {
  const { username, email } = req.body;
  const newUser = new User({ username, email });
  await newUser.save();
  res.status(201).send('User created');
});
