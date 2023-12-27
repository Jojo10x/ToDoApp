const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

//models
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

// Remove the following line
// mongoose.set("useFindAndModify", false);

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

app.set("view engine", "ejs");

// GET METHOD
app.get("/", async (req, res) => {
  try {
    const tasks = await TodoTask.find({}).exec();
    res.render("todo.ejs", { todoTasks: tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).send("Internal Server Error");
  }
});


//POST METHOD
app.post('/',async (req, res) => {
  const todoTask = new TodoTask({
  content: req.body.content
  });
  try {
  await todoTask.save();
  res.redirect("/");
  } catch (err) {
  res.redirect("/");
  }
  });

  //UPDATE
  app.route("/edit/:id")
  .get(async (req, res) => {
    const id = req.params.id;
    try {
      const tasks = await TodoTask.find({}).exec();
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    } catch (err) {
      console.error("Error fetching tasks:", err);
      res.status(500).send("Internal Server Error");
    }
  })
  .post(async (req, res) => {
    const id = req.params.id;
    try {
      await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
      res.redirect("/");
    } catch (err) {
      console.error("Error updating task:", err);
      res.status(500).send("Internal Server Error");
    }
  });

//DELETE
app.route("/remove/:id").get(async (req, res) => {
  const id = req.params.id;
  try {
    await TodoTask.findByIdAndDelete(id);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Internal Server Error");
  }
});