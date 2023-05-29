const {
  getAllLaunches,
  addLaunch,
  abortLaunch,
} = require("../../models/launches.model");

const httpGetAllLaunches = (req, res) => {
  res.status(200).json(getAllLaunches());
};

const httpAddLaunch = (req, res) => {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.target ||
    !launch.launchDate ||
    !launch.rocket
  ) {
    return res.status(400).json({
      error: "Invalid launch data",
    });
  }

  const launchDate = new Date(launch.launchDate);
  if (isNaN(launchDate)) {
    return res.status(400).json({
      error: "Invalid date formatt",
    });
  }
  launch.launchDate = launchDate;
  const result = addLaunch(launch);
  return res.status(201).json(result);
};

const httpAbortLaunch = (req, res) => {
  const flightNumber = parseInt(req.params.id);
  const launch = abortLaunch(flightNumber);
  if (launch) {
    return res.status(200).json(launch);
  } else {
    res.status(404).json({
      error: "Mission not found",
    });
  }
};

module.exports = {
  httpGetAllLaunches,
  httpAddLaunch,
  httpAbortLaunch,
};
