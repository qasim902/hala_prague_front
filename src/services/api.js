import axios from "axios";

const networkService = {
  service: this,
  serverUrl: "https://api.planet-destinations.com/parse/",
  parseAppId: "pragenow",
  suitId: "5db9ac6d13e31d005e29691a",
  services: [
    {
      name: "login",
      url: "/functions/login",
      method: "POST"
    },
    {
      name: "verifyOtp",
      url: "/functions/verifyOtp",
      method: "POST"
    },

    {
      name: "dashboard",
      url: "/functions/dashboard",
      method: "POST"
    },

    // create ad
    {
      name: "createAd",
      url: "/functions/advertisementBanners",
      method: "POST"
    },
    {
      name: "deleteAd",
      url: "/classes/advertisementBanners/{objectId}",
      method: "DELETE"
    },
    {
      name: "getAds",
      url: "/classes/advertisementBanners",
      method: "GET"
    },

    {
      name: "createCategory",
      url: "/classes/Categories",
      method: "POST"
    },
    {
      name: "updateCategory",
      url: "/classes/Categories/{objectId}",
      method: "PUT"
    },
    {
      name: "updateSubCategory",
      url: "/classes/SubCategory/{objectId}",
      method: "PUT"
    },
    {
      name: "deleteCategory",
      url: "/functions/deleteCategory",
      method: "POST"
    },
    {
      name: "createSubCategory",
      url: "/functions/subcategory",
      method: "POST"
    },
    {
      name: "deleteSubCategory",
      url: "/functions/deleteSubCategory",
      method: "POST"
    },
    {
      name: "createSectionItem",
      url: "/functions/sectionItem",
      method: "POST"
    },
    {
      name: "updateSectionItem",
      url: "/classes/SectionsItem/{objectId}",
      method: "PUT"
    },
    {
      name: "deleteSectionItem",
      url: "/functions/deleteSectionItem",
      method: "POST"
    },
    {
      name: "createPlannedTrip",
      url: "/classes/PlannedTrip",
      method: "POST"
    },
    {
      name: "updateStaticPage",
      url: "/classes/StaticPages/{objectId}",
      method: "PUT"
    },
    {
      name: "updatePlannedTrip",
      url: "/classes/PlannedTrip/{objectId}",
      method: "PUT"
    },
    {
      name: "deleteEmbassy",
      url: "/classes/Embassies/{objectId}",
      method: "DELETE"
    },
    {
      name: "deletePlannedTrip",
      url: "/classes/PlannedTrip/{objectId}",
      method: "DELETE"
    },
    {
      name: "getEmbassies",
      url: "/classes/Embassies",
      method: "GET"
    },
    {
      name: "updateEmbassy",
      url: "/classes/Embassies/{objectId}",
      method: "PUT"
    },
    {
      name: "getStaticPages",
      url: "/classes/StaticPages",
      method: "GET"
    },
    { name: "fileUpload", url: "files/", method: "POST" }
  ],
  getService: function(name) {
    for (let service of this.services)
      if (service.name === name) return service;
  },
  send: function(name, data) {
    //inspect the value
    let service = { ...this.getService(name) };
    if (name === "fileUpload") {
      service.url += data.name;
    }

    if (service.url.includes("{")) {
      for (let attr in data) {
        let search = "{" + attr + "}";
        if (service.url.includes(search))
          service.url = service.url.replace(search, data[attr]);
      }
    }

    let request = {
      method: service.method,
      url: this.serverUrl + service.url
    };
    if (data) request.data = data;

    console.log(request);

    request.headers = {};
    request.headers["x-parse-application-id"] = this.parseAppId;
    if (name === "fileUpload") {
      request.data = data.data;
      request.headers["Content-Type"] = "image";
    }
    request.headers["x-parse-master-key"] =
      "MASTER-30c0bff7b37fcd871e2bec3aeb685852e2f8d1d683a97d6d9a0c1de7fba2cb8e";
    return axios(request);
  },
  sendSilentPush: function() {
    axios({
      method: "post",
      url: "https://notify.appgain.io/5db9b9ef681ca4000ab4769b/send",
      data: {
        appPush: {
          "content-available": 1,
          sound: "",
          op: "update"
        }
      },
      headers: {
        "Content-Type": "application/json",
        appapikey:
          "36be548b316a19d741da2421ba373736257fde7fffe418f27d746f1db9c6dac4"
      }
    });
  }
};

export default networkService;
