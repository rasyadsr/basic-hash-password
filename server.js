const express = require("express");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    // By default salt nya 10
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // console.log(salt);
    // console.log(hashedPassword);
    const user = {
      name: req.body.name,
      password: hashedPassword,
    };
    users.push(user);
    res.status(201).send("Successfully created!");
  } catch (error) {
    res.status(500).end();
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.name == req.body.name);
  if (user == null) {
    return res.status(400).send("Cannot find user!");
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    } else {
      res.send("Not allowed");
    }
  } catch (error) {
    res.status(500).end();
  }
});

app.listen(3000);
