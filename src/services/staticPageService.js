import networkService from "./api.js";
import dataService from "./dataService.js";
import fileService from "./fileService.js";

const staticPageService = {
  getStaticPages: async function() {
    return await networkService.send("getStaticPages", null);
  },
  updateStaticPage: async (page, formData, RichDescription) => {
    dataService.clearAttributes(page, ["createdAt", "updatedAt", "className"]);

    let data = dataService.parseForm(["img"], formData);
    if (data.img.name !== "") {
      page.img = await fileService.upload(data.img);
    }

    page.description = RichDescription;

    console.log("page: ", page);

    await networkService.send("updateStaticPage", page);
    return page;
  },
  deletePage: async id => {
    return await networkService.send("deleteStaticPage", { objectId: id });
  }
};

export default staticPageService;
