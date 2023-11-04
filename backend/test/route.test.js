"use strict";

const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../index");
const Joke = require("../models/joke");
chai.use(chaiHttp);

describe("Test server route", () => {
  describe("Test '/' route", () => {
    it("GET / should successfully", (done) => {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {
          res.should.have.status(200);
          done(err);
        });
    });

    it("GET / should not found if you have already voted all jokes", (done) => {
      chai
        .request(server)
        .get("/")
        .set(
          "Cookie",
          "6544cb49e954a66e0dda7ae9=voted; 6544cb49e954a66e0dda7aea=voted; 6544cb49e954a66e0dda7aeb=voted; 6544cb49e954a66e0dda7aec=voted; Secure; HttpOnly"
        )
        .end((err, res) => {
          res.should.have.status(404);
          done(err);
        });
    });
  });

  describe("Test '/jokes/:id/vote' route", () => {
    after(() => {
      process.exit(); // shutdown server
    });
    it("GET /jokes/6544cb49e954a66e0dda7ae9/vote should successfully", (done) => {
      const requestBody = { voteType: "likes" };

      chai
        .request(server)
        .post("/jokes/6544cb49e954a66e0dda7ae9/vote")
        .send(requestBody)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("GET /jokes/6544cb49e954a66e0dda7ae9/vote should error because already voted", (done) => {
      const requestBody = { voteType: "likes" };

      chai
        .request(server)
        .post("/jokes/6544cb49e954a66e0dda7ae9/vote")
        .set("Cookie", "6544cb49e954a66e0dda7ae9=voted; Secure; HttpOnly")
        .send(requestBody)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
});
