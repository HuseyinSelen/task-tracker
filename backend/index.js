// backend/index.js
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:admin1@cluster0.gt2pafq.mongodb.net/tasktracker?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB bağlantısı başarılı"))
  .catch(err => console.error("❌ MongoDB bağlantı hatası:", err));

  const Task = mongoose.model('Task', {
    name: String,
    completed: Boolean
  });
  
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Geçici görev listesi (veritabanı yerine)
let tasks = [];

app.use(cors());
app.use(express.json());

// Görevleri getir
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});


// Yeni görev ekle
app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
});

// Görev sil
app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  });
  

// Yeni endpoint: Görevi tamamlandı olarak güncelle
app.put('/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.status(200).send();
  });
  
  

app.listen(PORT, () => {
  console.log(`✅ Backend API http://localhost:${PORT} üzerinde çalışıyor`);
});

