const { parse } = require("csv-parse");
const { createReadStream } = require("fs");
const path = require("path");

const result = [];

const isHabitable = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    createReadStream(path.join(__dirname, "../../data/planets.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (isHabitable(data)) result.push(data);
      })
      .on("error", (error) => {
        console.log(error);
        reject(error);
      })
      .on("end", () => {
        console.log("No more data");
        resolve();
      });
  });
}

module.exports = {
  planets: result,
  loadPlanetsData,
};
