import networkService from "./api.js";
import dataService from "./dataService.js";
import fileService from "./fileService.js";

const adService = {
  getAd: async function() {
    const ads = await networkService.send("getAds", null);
    return ads.data.results;
  },

  createAd: async formData => {
    let request = dataService.parseForm(["type", "img", 'url'], formData);
    request.img = await fileService.upload(request.img);
    const response = await networkService.send("createAd", request);
    request.objectId = response.data.result.objectId;
    request.createdAt = response.data.result.createdAt;
    dataService.saveOne("advertisementBanners", request);
  },

  deleteAd: async function(adId) {
    await networkService.send("deleteAd", { objectId: adId });
    dataService.deleteById("advertisementBanners", adId);
  }
};

export default adService;
