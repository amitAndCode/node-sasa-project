const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

const launch1 = {
  flightNumber: 100,
  target: "Kepler-442 b",
  launchDate: new Date("December 28, 2023"),
  rocket: "Dragon 1",
  mission: "First flight",
  upcoming: true,
  success: false,
  customer: ["Tesla", "Microsoft"],
};

async function getAllLaunches() {
  return await launchesDatabase.find({}, { __v: 0, id: 0 });
}

async function getLatestFlightNumber() {
  const flight = await launchesDatabase.findOne().sort({ flightNumber: -1 });
  if (!flight) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return flight.flightNumber;
}

async function saveLaunch(launch) {
  const target = launch.target;
  const planet = await planets.findOne({
    keplerName: target,
  });
  if (!planet) {
    throw new Error("Cannot find the target planet");
  }
  return await launchesDatabase.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    { upsert: true }
  );
}

async function addNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    success: true,
    upcoming: true,
    customers: [],
  });
  return await saveLaunch(newLaunch);
}

async function abortLaunch(flightNumber) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.modifiedCount === 1;
}

module.exports = {
  launches,
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
};
