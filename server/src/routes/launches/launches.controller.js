const {
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
} = require("../../models/launches.model");

const httpGetAllLaunches = async (req, res) => {
  const launchesData = await getAllLaunches();
  res.status(200).json(launchesData);
};

const httpAddLaunch = async (req, res) => {
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
  const result = await addNewLaunch(launch);
  return res.status(201).json(result);
};

const httpAbortLaunch = async (req, res) => {
  const flightNumber = parseInt(req.params.id);
  const aborted = await abortLaunch(flightNumber);
  if (aborted) {
    return res.status(200).json({ ok: true });
  } else {
    res.status(404).json({
      error: "launch not aborted",
    });
  }
};

module.exports = {
  httpGetAllLaunches,
  httpAddLaunch,
  httpAbortLaunch,
};
