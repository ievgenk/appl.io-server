const { MONGODB_URI } = require("../config");

const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");

const app = require("../server");

const expect = chai.expect;
chai.use(chaiHttp);

describe("USER AUTH TESTING", function() {
  before(async function() {
    await mongoose.connect(MONGODB_URI);
  });

  it("Should register a new user", async function() {
    let registeredUser = await chai
      .request(app)
      .post("/users/signup")
      .send({
        email: "test@testing.ca",
        password: "coolpass"
      });

    expect(registeredUser).to.have.status(201);
    expect(registeredUser.body.message).to.equal("User Created");
  });

  it("Should fail to register a new user", async function() {
    let registeredUser = await chai
      .request(app)
      .post("/users/signup")
      .send({
        email: "test@testing.ca",
        password: "1"
      });

    expect(registeredUser).to.have.status(500);
  });

  it("Should login registered user", async function() {
    let loggedInUser = await chai
      .request(app)
      .post("/users/login")
      .send({
        email: "test@testing.ca",
        password: "coolpass"
      });

    expect(loggedInUser.body).to.contain.keys(["token", "user"]);
    expect(loggedInUser).to.have.status(200);
  });

  it("Should fail to login registered user", async function() {
    let loggedInUser = await chai
      .request(app)
      .post("/users/login")
      .send({
        email: "test@testing.ca",
        password: "1"
      });

    expect(loggedInUser).to.have.status(401);
  });

  after(async function() {
    await mongoose.connection.dropCollection("users");
    await mongoose.disconnect();
  });
});
