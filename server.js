const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());

const blogRouter = require("./blogRouter");

//Log
app.use(morgan('common'));

//Router
app.use("/blog-posts", blogRouter);

/*   Server   */
let server;

function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
        server = app
            .listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve(server);
            })
            .on("error", err => {
                reject(err);
            });
    });
}

function closeServer() {
    return new Promise((resolve, reject) => {
        console.log("Closing server");
        server.close(err => {
            if (err) {
                reject(err);
                // so we don't also call `resolve()`
                return;
            }
            resolve();
        });
    });
}

/*   Export   */

if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };