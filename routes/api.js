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
      .catch(() => {
        res.status(500).send("Could not save card");
      });
  });
});

//Update Card

router.put("/cards", checkAuth, (req, res) => {
  const { cardId, cardFieldName, cardFieldValue } = req.body;

  Card.findByIdAndUpdate(
    cardId,
    { $set: { [cardFieldName]: [cardFieldValue] } },
    { new: true }
  )
    .exec()
    .then(() => {
      res.status(200).send("Card updated successfully");
    })
    .catch(() => {
      res.status(500).send("Could not update the card");
    });
});

// DELETING A CARD

router.delete("/cards", checkAuth, (req, res) => {
  const { _id } = req.body;

  Card.findByIdAndRemove(_id)
    .then(() => {
      res.status(200).send("Card deleted successfully");
    })
    .catch(() => {
      res.status(500).send("Could not delete the card");
    });
});

//MOVING A CARD WITHIN BOARD

router.put("/move/within", checkAuth, (req, res) => {
  const { cardIds, boardId } = req.body;

  Board.findByIdAndUpdate(
    boardId,
    {
      $set: { cards: cardIds }
    },
    { new: true }
  )
    .then(() => {
      res.status(200).send("Card was moved within board successfully");
    })
    .catch(() => {
      res.status(500).send("Could not card move card within board");
    });
});

//MOVING A CARD ACROSS THE BOARD

router.put("/move/across", checkAuth, (req, res) => {
  const { startBoard, finishBoard } = req.body;

  Board.findByIdAndUpdate(
    startBoard._id,
    {
      $set: { cards: startBoard.cardIds }
    },
    { new: true }
  ).then(() => {
    Board.findByIdAndUpdate(
      finishBoard._id,
      {
        $set: { cards: finishBoard.cardIds }
      },
      { new: true }
    )
      .then(() => {
        res
          .status(200)
          .send("Card was moved across to a different board successfully");
      })
      .catch(() => {
        res
          .status(500)
          .send("Could not card move card across to a different board");
      });
  });
});

module.exports = router;
