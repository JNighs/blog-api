const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe("Blog Posts", function () {
    before(function () {
        return runServer();
    });
    after(function () {
        return closeServer();
    });

    it ("should list posts on GET", function () {
        return chai.request(app).get("/blog-posts").then (function (res) {
            expect(res).to.have.status(200);
        });
    });
});