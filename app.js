const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const validationRouter = require("./routers/validationRouter");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: true }));
app.use(bodyparser.json());

app.get("/", (req, res) => {
  output = {
    message: "My Rule-Validation API",
    status: "success",
    data: {
      name: "Isong Josiah",
      github: "@isongjosiah",
      email: "isongjosiah@gmail.com",
      mobile: "08082736700",
      twitter: "@1st_Josiah",
    },
  };
  res.status(200).json(output);
});

app.use(validationRouter);

app.use((err, req, res, next) => {
  // check for invalid json error coming from body-parser
  /* since I am using body parser, this is a hack to output the error message if an invalid JSON object is passed to the endpoint. It checks for the error type entity.parse.failed which indicates that there was an error parsing the JSON file by bodyparser and by extension the JSON payload was invalid*/
  if (err.type === "entity.parse.failed") {
    output = {
      message: "Invalid JSON payload passed.",
      status: "error",
      data: null,
    };
    res.status(400).json(output);
  }
});

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
