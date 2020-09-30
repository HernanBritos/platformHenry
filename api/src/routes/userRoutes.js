const { createUser, getAllUsers } = require("../controllers/userController");

const router = require("express").Router();

router
   .route("/")
   .post((req, res) => {
      createUser(req.body)
         .then((user) => res.status(201).json(user))
         .catch((err) => res.status(400).send(err));
   })
   .get((req, res) => {
      getAllUsers()
         .then((users) => res.json(users))
         .catch((err) => res.status(400).send(err));
   });

// router
//    .route("/:id")
//    .delete((req, res) = {
//     const {
//         id
//       } = req.params;
//     }
module.exports = router;
