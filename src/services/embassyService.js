import networkService from "./api.js";
import dataService from "./dataService.js";

const embassyService = {
  getEmbassies: async function() {
    return await networkService.send("getEmbassies", null);
  },
  deleteEmbassy: async id => {
    return await networkService.send("deleteEmbassy", { objectId: id });
  },
  updateEmbassy: async embassy => {
    dataService.clearAttributes(embassy, [
      "createdAt",
      "updatedAt",
      "className"
    ]);
    return await networkService.send("updateEmbassy", embassy);
  }
};

export default embassyService;
