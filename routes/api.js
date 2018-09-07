let express = require("express");
let router = express.Router();
const { Board, Card } = require("../models/userModel");
const { checkAuth } = require("../middleware/auth");

//Middleware
router.use(express.json());

//Getting Boards

router.get("/boards", checkAuth, (req, res) => {
  Board.find({
    user: req.userId
  })
    .then(boards => {
      res.status(200).json(boards);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

//Create Card

router.post("/cards", checkAuth, (req, res) => {
  const { companyName, postingURL, boardId } = req.body;

  const card = new Card({
    companyName,
    postingURL,
    board: boardId
  });

  card
    .save()
    .then(() => {
      res.status(200).send("Card saved successfully");
    })
    .catch(err => {
      res.status(500).send("Could not save card");
    });
});

module.exports = router;
