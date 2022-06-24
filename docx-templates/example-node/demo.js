const { createReport } = require("docx-templates");

const fs = require("fs");
const path = require("path");

const template = fs.readFileSync(
  path.resolve(__dirname, "./input.docx"),
  "binary"
);

createReport({
  template,
  cmdDelimiter: ["{{", "}}"],
  data: {
    name: "John",
  },
}).then((buffer) => {
  fs.writeFileSync(path.resolve(__dirname, "./output.docx"), buffer);
});
