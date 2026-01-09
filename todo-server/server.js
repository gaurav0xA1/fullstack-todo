const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


// Use environment variable for MongoDB connection (for Render/.env support)
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';
console.log('Connecting to MongoDB:', mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//<username>:<password>@')); // Log without showing password
mongoose.connect(mongoUri);

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  completed: Boolean,
  userId: String, // Associate each task with a user
});
const Task = mongoose.model('Task', TaskSchema);

// Helper to get start and end of current week (Monday-Sunday)
function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  // JS: Sunday=0, Monday=1, ..., Saturday=6
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0,0,0,0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23,59,59,999);
  return { start: monday, end: sunday };
}

// GET weekly summary for a user
app.get('/api/weekly-summary/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    const { start, end } = getWeekRange();
    // Assume task.date is ISO string or YYYY-MM-DD
    // Convert week range to YYYY-MM-DD for comparison
    const startStr = start.toISOString().slice(0,10);
    const endStr = end.toISOString().slice(0,10);
    // Find tasks for user in this week
    const tasks = await Task.find({
      userId,
      date: { $gte: startStr, $lte: endStr }
    });
    // Summarize
    const summary = {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      byDay: {}
    };
    // Group by day
    tasks.forEach(t => {
      if (!summary.byDay[t.date]) summary.byDay[t.date] = { total: 0, completed: 0, pending: 0 };
      summary.byDay[t.date].total++;
      if (t.completed) summary.byDay[t.date].completed++;
      else summary.byDay[t.date].pending++;
    });
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get weekly summary' });
  }
});

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