// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Create an Express app
const app = express();
app.use(bodyParser.json());

//Exporting app
module.exports = app;

// Set up PostgreSQL database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '12345',
  port: 5432,
});

// Create a table named 'todos' in your PostgreSQL database to store To-Do items
// Ensure it has columns like 'id', 'title', 'description', 'status', etc.

// 1. Create a new To-Do item
app.post('/todos', async (req, res) => {
  const { title, description, status, due_date } = req.body;
  console.log(req.body);

  try {
    // Insert the new To-Do item into the database
    const query = 'INSERT INTO todos (title, description, status, due_date) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [title, description, status, due_date];

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]); // Return the created To-Do item
  } catch (error) {
    console.error('Error creating To-Do item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. Retrieve a list of all To-Do items
app.get('/todos', async (req, res) => {
  try {
    // Fetch all To-Do items from the database
    const query = 'SELECT * FROM todos';
    const result = await pool.query(query);

    res.json(result.rows); // Return the list of To-Do items
  } catch (error) {
    console.error('Error retrieving To-Do items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3. Retrieve a single To-Do item by its ID
app.get('/todos/:id', async (req, res) => {
  const todoId = req.params.id;

  try {
    // Fetch the To-Do item with the specified ID from the database
    const query = 'SELECT * FROM todos WHERE id = $1';
    const values = [todoId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'To-Do item not found' });
    } else {
      res.json(result.rows[0]); // Return the single To-Do item
    }
  } catch (error) {
    console.error('Error retrieving To-Do item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. Update a To-Do item
app.put('/todos/:id', async (req, res) => {
  const todoId = req.params.id;
  const { title, description, status, due_date } = req.body;

  try {
    // Update the To-Do item with the specified ID in the database
    const query = 'UPDATE todos SET title = $1, description = $2, status = $3, due_date = $4 WHERE id = $5 RETURNING *';
    const values = [title, description, status, due_date, todoId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'To-Do item not found' });
    } else {
      res.json(result.rows[0]); // Return the updated To-Do item
    }
  } catch (error) {
    console.error('Error updating To-Do item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 5. Delete a To-Do item
app.delete('/todos/:id', async (req, res) => {
  const todoId = req.params.id;

  try {
    // Delete the To-Do item with the specified ID from the database
    const query = 'DELETE FROM todos WHERE id = $1 RETURNING *';
    const values = [todoId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'To-Do item not found' });
    } else {
      res.json({ message: 'To-Do item deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting To-Do item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});