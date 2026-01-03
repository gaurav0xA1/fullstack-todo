const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');



const app = express();
app.use(cors());
app.use(express.json());


// simple in-memory tasks for demo
const tasks = [
  { id: 1, title: 'Backend connection test', date: '2025-12-12', completed: false }
];

mongoose.connect('mongodb://localhost:27017/todoapp');

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  completed: Boolean,
  userId: String, // Associate each task with a user
});
const Task = mongoose.model('Task', TaskSchema);

// GET tasks from MongoDB, filtered by userId
app.get('/api/tasks', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    const tasks = await Task.find({ userId });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST new task to MongoDB, with userId
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, date, userId } = req.body || {};
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    const newTask = new Task({ title, description, date, completed: false, userId });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// PATCH update task (completion, title, description, date)
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Only update provided fields
    const updateFields = {};
    if (req.body.hasOwnProperty('completed')) updateFields.completed = req.body.completed;
    if (req.body.hasOwnProperty('title')) updateFields.title = req.body.title;
    if (req.body.hasOwnProperty('description')) updateFields.description = req.body.description;
    if (req.body.hasOwnProperty('date')) updateFields.date = req.body.date;
    if (req.body.hasOwnProperty('userId')) updateFields.userId = req.body.userId;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});


// Example: DELETE /api/tasks/:id
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // If using MongoDB with Mongoose:
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.post('/api/click', (req, res) => {
  console.log('button clicked', req.body || {});
  res.json({ ok: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started at port ${PORT}`));