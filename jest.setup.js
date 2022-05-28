const dotenv = require("dotenv-safe");
// import dotenv from "dotenv-safe";

dotenv.config({
  path: "./.env.spec",
});

// if (dotenv) {
//     dotenv.config({
//         path: './.env.spec',
//     });
// } else {
//     console.error('Could not load "dotenv-safe"');
// }
