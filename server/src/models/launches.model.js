const axios = require("axios");
const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const launches = new Map();

const SPACES_LAUNCHES_URL = "https://api.spacexdata.com/v4/launches/query";

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
  return await launchesDatabase.find({}, { __v: 0, __id: 0 });
}

async function getLatestFlightNumber() {
  const flight = await launchesDatabase.findOne().sort({ flightNumber: -1 });
  if (!flight) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return flight.flightNumber;
}

async function getExternalLaunchesData() {
  const firstExternalLaunch = await findLaunchByQuery({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstExternalLaunch) {
    console.log("Extenal launch data already saved");
  } else {
    await downloadAndSaveExternalLaunches();
  }
}

async function findLaunchByQuery(filter) {
  return await launchesDatabase.findOne(filter);
}

async function downloadAndSaveExternalLaunches() {
  const response = await axios.post(SPACES_LAUNCHES_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("something went wrong while downloading external laucnhes...");
    throw new Error(
      "something went wrong while downloading external laucnhes..."
    );
  }

  const launchesDocs = response.data.docs;

  for (let launchDoc of launchesDocs) {
    const customers = launchDoc["payloads"].flatMap(
      (payload) => payload["customers"]
    );
    const launch = {
      flightNumber: launchDoc["flight_number"],
      launchDate: new Date(launchDoc["date_local"]),
      rocket: launchDoc["rocket"]["name"],
      mission: launchDoc["name"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    await saveLaunch(launch);
  }
}

async function saveLaunch(launch) {
  return await launchesDatabase.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    { upsert: true }
  );
}

async function addNewLaunch(launch) {
  const target = launch.target;
  const planet = await planets.findOne({
    keplerName: target,
  });
  if (!planet) {
    throw new Error("Cannot find the target planet");
  }
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
  getExternalLaunchesData,
};
