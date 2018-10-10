const express = require('express');
const mongoose = require("mongoose");
const { PORT, DATABASE_URL } = require("./config");
const blogRouter = require("./blogRouter");

mongoose.Promise = global.Promise;

const app = express();
app.use(express.json());

console.log(DATABASE_URL);

//Router
app.use("/blog-posts", blogRouter);

app.use("*", function (req, res) {
    res.status(404).json({ message: "Not Found" });
});

/*   Server   */
let server;

function runServer(databaseURL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseURL, err => {
            if (err) { return reject(err) };
            server = app.listen(port, () => {
                console.log(`You app is listening on port ${port}`);
                resolve();
            })
                .on("error", err => {
                    mongoose.disconnect();
                    reject(err);
                })
        })
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log("Closing server");
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            })
        });
    });
}

/*   Export   */

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };