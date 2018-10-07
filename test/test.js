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

    it("should list posts on GET", function () {
        return chai.request(app).get("/blog-posts").then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a("array");
            expect(res.body.length).to.be.at.least(1);

            const expectedKeys = ['title', 'content', 'author'];
            res.body.forEach(function (item) {
                expect(item).to.be.a("object");
                expect(item).to.include.keys(expectedKeys);
            });
        });
    });

    it("should add a blog post on POST", function () {
        const newPost = { title: "New Title", content: "New content", author: "New Author" };
        return chai.request(app).post("/blog-posts").send(newPost).then(function (res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a("object");
            expect(res.body).to.include.keys("title", "content", "author");
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.equal(
                Object.assign(newPost, { id: res.body.id, publishDate: res.body.publishDate })
            );
        });
    });

    it("should update blog post on PUT", function () {
        const updateData = {
            title: "foo",
            content: "foo",
            author: "bar"
        };

        return (chai.request(app).get("/blog-posts").then(function (res) {
            updateData.id = res.body[0].id;
            updateData.publishDate = res.body[0].publishDate;
            return chai.request(app).put(`/blog-posts/${updateData.id}`).send(updateData);
        })
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a("object");
                expect(res.body).to.deep.equal(updateData);
            })
        );
    });

    it("should delete blog post on DELETE", function () {
        return (chai.request(app).get("/blog-posts").then(function (res) {
            return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
        })
            .then(function (res) {
                expect(res).to.have.status(204);
            })
        );
    });
});