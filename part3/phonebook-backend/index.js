require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person.js");
const mongoose = require("mongoose");

const app = express();

// middleware
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.get("/info", (req, res) => {
  Person
    .countDocuments({})
    .then((count) => {
      res.send(`Phonebook has info for ${count} people<br />${new Date()}`)
    });
});

app.get("/api/persons", (req, res) => {
  Person
    .find({})
    .then((people) => res.json(people));
});

app.get("/api/persons/:id", (req, res) => {
  Person
    .findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res) => {
  Person
    .findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({ error: "name missing" });
  }

  if (!body.number) {
    return res.status(400).json({ error: "number missing" });
  }

  Person
    .countDocuments({ name: body.name })
    .then((count) => {
      if (count > 0) {
        return res.status(400).json({ error: "name must be unique" });
      }

      const person = new Person({
        name: body.name,
        number: body.number,
      });
    
      person.save().then((savedPerson) => {
        res.json(savedPerson);
      });
    });
});

// unknown endpoint
app.use((req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});