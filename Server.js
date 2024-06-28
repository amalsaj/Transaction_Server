const express = require("express");
// const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./db/db");
const User = require("./model/userModel");
const Data = require("./model/dummyData");
const generateTokensAndSetCookies = require("./utils/generateTokens");
const cors = require("cors")
// / Serve images from the 'uploads' directory

// Connect to MongoDB
connectDB();

// Set up body parser middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());

// / Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/transaction/build")));

app.use(cors())

// Route to serve the React app
app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../client/transaction/build", "index.html")
  );
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).send("Username already exists.");
    }
    // Validating the username and password with regex
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (usernameRegex.test(username)) {
      console.log("Valid username");
    } else {
      return res
        .status(400)
        .send(
          "Your username should start with a letter and be 3 to 16 characters long, allowing letters, numbers, underscores, and hyphens."
        );
    }
    if (passwordRegex.test(password)) {
      console.log("Valid password");
    } else {
      return res
        .status(400)
        .send(
          "Your password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character."
        );
    }

    // Create a new user document
    const newUser = new User({ username, password });

    // TOKEN GENERATOR
    generateTokensAndSetCookies(newUser._id, res);

    // Save the new user to the database
    await newUser.save();

    // Sign up successful
    res.status(201).send("Sign-up Successful.");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error.");
  }
});

app.post("/login", async (req, res) => {
  console.log("in loginnnnnn");
  console.log(req.body);
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    let message;
    if (user.type === "credit") {
      message = "true";
    } else if (user.type === "debit") {
      message = "false";
    } else {
      return res.status(404).json({ message: "User type not found" });
    }

    // TOKEN GENERATOR
    // generateTokensAndSetCookies(user._id, res);

    return res.status(200).json({ message, user });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/logout", async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Loggged out successfully" });
  } catch (error) {
    console.log("error in logout", error.message);
    res.status(500).status({ "internal server error": error });
  }
});
const { addData } = require("./controller/dummyController");
app.post("/addData", addData);

const { getData } = require("./controller/dummyController");
app.get("/getData", getData);

const { creditData } = require("./controller/dummyController");
app.put("/creditData/:name", creditData);

const { debitData } = require("./controller/dummyController");
app.put("/debitData/:name", debitData);

app.get("/getUsers", async (req,res) => {
  try {
        const filteredUsers = await User.find()
        res.status(200).json(filteredUsers) 
  } catch (error) {
    console.log("Error :",error)
    res.status(500).json("internal server error")
  }
})

// DELETE ADMIN USER
app.delete("/delete/:id", async (req,res) => {
  try{
    const {id} = req.params
    await User.findByIdAndDelete(id)
    res.status(200).json("Deleted succesfully")
  }
  catch (error){
    console.log(error)
    res.status(500).json({"internal server error": error})
  }
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
