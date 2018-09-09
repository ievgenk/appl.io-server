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
  const {
    companyName,
    postingURL,
    boardId,
    contactName,
    contactEmail,
    contactPhone,
    date
  } = req.body;

  const card = new Card({
    companyName,
    postingURL,
    boardId,
    contactName,
    contactEmail,
    contactPhone,
    date
  });

  card.save().then(card => {
    console.log("Card", card);
    return Board.findByIdAndUpdate(
      card.boardId,
      { $push: { cards: card._id } },
      { new: true }
    )
      .then(() => {
        res.status(200).send("Card saved successfully");
      })
      .catch(err => {
        res.status(500).send("Could not save card");
      });
  });
});

//Update Card

router.put("/cards", checkAuth, (req, res) => {
  console.log(req.body);

  const { cardId, cardFieldName, cardFieldValue } = req.body;

  let field = cardFieldName;
  let val = cardFieldValue;

  Card.findByIdAndUpdate(cardId, { field: val }, { new: true })
    .exec()
    .then(updatedCard => {
      console.log(updatedCard);
      res.status(200).send("Card updated successfully");
    })
    .catch(err => {
      res.status(500).send("Could not update the card");
    });
});
module.exports = router;
