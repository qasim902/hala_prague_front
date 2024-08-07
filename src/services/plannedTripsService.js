import networkService from "./api.js";
import dataService from "./dataService.js";
import fileService from "./fileService.js";

const plannedTripsService = {
  create: async (desAr, desEn, days, formData) => {
    let request = dataService.parseForm(
      ["labelEn", "labelAr", "price", "image"],
      formData
    );

    if (request.image.name !== "") {
      request.img = await fileService.upload(request.image);
    }

    request.label = {
      en: request.labelEn,
      ar: request.labelAr
    };

    request.description = {
      en: desEn,
      ar: desAr
    };

    days.forEach(day => {
      day.day = Number(day.day);
      day.locations = day.locations.map(location => {
        return location.objectId;
      });
    });

    request.days = days;
    request.price = Number(request.price);

    dataService.clearAttributes(request, ["labelEn", "labelAr", "image"]);

    let res = await networkService.send("createPlannedTrip", request);

    request.objectId = res.data.objectId;
    request.createdAt = res.data.createdAt;

    dataService.saveOne("plannedTrips", request);
  },
  loadPlannedTrips() {
    let plannedTrips = dataService.load("plannedTrips");
    plannedTrips.forEach(trip => {
      trip.days = trip.days.map(day => {
        return {
          day: day.day,
          locations: day.locations.map(location => {
            return dataService.findById("sectionItems", location);
          })
        };
      });
    });
    return plannedTrips;
  },
  deleteSectionItem: (id, trips) => {
    for (let trip of trips) {
      trip = dataService.findById("plannedTrips", trip);
      for (let day of trip.days) {
        if (day.locations.includes(id))
          day.locations.splice(day.locations.indexOf(id), 1);
      }
      dataService.updateById("plannedTrips", trip.objectId, trip);
    }
  },
  getItemTrips: id => {
    let trips = [];
    let plannedTrips = dataService.load("plannedTrips");

    for (let trip of plannedTrips) {
      for (let day of trip.days) {
        if (day.locations.includes(id)) {
          if (trips.indexOf(trip.objectId) < 0) trips.push(trip.objectId);
        }
      }
    }
    return trips;
  },
  updateTrip: async (formData, trip) => {
    let img = formData.get("image");

    if (img.name !== "") {
      trip.img = await fileService.upload(img);
    }

    dataService.clearAttributes(trip, ["createdAt", "updatedAt", "__type"]);

    trip.days.forEach(day => {
      day.day = Number(day.day);
      day.locations = day.locations.map(location => {
        return location.objectId;
      });
    });

    trip.price = Number(trip.price);

    await networkService.send("updatePlannedTrip", trip);

    dataService.updateById("plannedTrips", trip.objectId, trip);
  },
  deleteTrip: async id => {
    await networkService.send("deletePlannedTrip", { objectId: id });
    dataService.deleteById("plannedTrips", id);
  }
};

export default plannedTripsService;
