const express = require("express");
const app = express();

const path = require("path");
const cors = require("cors");
const { logger, errorHandler } = require("./middleware/logEvent");
const corsOptions = require('./config/corsOptions');

const PORT = process.env.PORT || 3500;

// MARK: 🍎 Custom Middleware logger
app.use(logger);

// MARK: 🍎 cors
app.use(cors(corsOptions));

// MARK: 🍎 urlencoded data (built in middleware)
// in other words, form data:L
// 'cotent-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// MARK: - 🍎 json (built in middleware)
app.use(express.json());

// MARK: - 🍎 serve static files[css, images, js, text] (built in middleware)
app.use('/'      , express.static(path.join(__dirname, "/public")));
app.use('/subdir', express.static(path.join(__dirname, "/public")));

// MARK: - 🍎 Router Handlers
app.use('/'         , require('./routes/root'))
app.use('/subdir'   , require('./routes/subdir'))
app.use('/employees', require('./routes/api/employees'))   // rest api json-data delivery which not use html
app.use('/register' , require('./routes/api/register'))    // rest api user register      (post)
app.use('/auth'     , require('./routes/api/auth'))        // rest api user authrization  (post)

// MARK: - 404 page
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
