const fs = require("fs");

fs.copyFile("src/_redirects", "build/_redirects", err => {
  if (err) throw err;
  console.log("Successfully added _redirects to build folder");
});

fs.copyFile("src/netlify.toml", "build/netlify.toml", err => {
  if (err) throw err;
  console.log("Successfully added netlify.toml to build folder");
});
