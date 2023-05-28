const { Router } = require("express");

const { getAllPlanets } = require("./planets.controller");

const planetsRouter = Router();

planetsRouter.get("/", getAllPlanets);

module.exports = planetsRouter;
