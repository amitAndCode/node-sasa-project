const launches = new Map();

let latestFlightNumber = 100;

const launch1 = {
  flightNumber: 100,
  target: "Keplar 1",
  launchDate: new Date("December 28, 2023"),
  rocket: "Dragon 1",
  mission: "First flight",
  upcoming: true,
  success: false,
  customer: ["Tesla", "Microsoft"],
};

launches.set(100, launch1);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addLaunch(launch) {
  latestFlightNumber++;
  const data = Object.assign(launch, {
    flightNumber: latestFlightNumber,
    upcoming: true,
    success: true,
    customer: [],
  });
  launches.set(latestFlightNumber, data);
  return data;
}

function abortLaunch(flightNumber) {
  if (launches.has(flightNumber)) {
    const launch = launches.get(flightNumber);
    launch.success = false;
    launch.upcoming = false;
    launches.set(flightNumber, launch);
    return launch;
  } else {
    return null;
  }
}

module.exports = {
  launches,
  getAllLaunches,
  addLaunch,
  abortLaunch,
};
