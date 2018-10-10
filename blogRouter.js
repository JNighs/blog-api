const express = require("express");
const router = express.Router();

const { BlogPost } = require("./models");

/*
BlogPosts.create('Title One', 'Blah', 'James Nighswonger');
BlogPosts.create('Title Two', 'Blah Blah', 'James Nighswonger');
BlogPosts.create('Title Three', 'Blah Blah Blah', 'James Nighswonger');

router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});
*/

// GET requests to /restaurants => return 10 restaurants
router.get("/", (req, res) => {
    BlogPost.find()
      // we're limiting because restaurants db has > 25,000
      // documents, and that's too much to process/return
      .limit(10)
      // success callback: for each restaurant we got back, we'll
      // call the `.serialize` instance method we've created in
      // models.js in order to only expose the data we want the API return.    
      .then(blogPosts => {
        res.json({
            blogPosts: blogPosts.map(blogPost => blogPost.serialize())
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      });
  });

/*
router.post('/', (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.id}\``);
    res.status(204).end();
});

router.put('/:id', (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    if (req.params.id !== req.body.id) {
        const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }

    console.log(`Updating blog post \`${req.params.id}\``);
    const updatedItem = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    });
    res.status(200).json(updatedItem);
})

module.exports = router;
*/