import networkService from "./api.js";
import dataService from "./dataService.js";
import fileService from "./fileService.js";

const categoryService = {
  updateCategory: async (category, formData) => {
    let { mapIcon, section } = dataService.parseForm(
      ["mapIcon", "section"],
      formData
    );

    if (mapIcon) {
      mapIcon = mapIcon.name === "" ? null : mapIcon;
    }

    if (mapIcon) category.mapIcon = await fileService.upload(mapIcon);
    category.section = {
      className: "Sections",
      __type: "Pointer",
      objectId: section
    };
    dataService.clearAttributes(category, [
      "createdAt",
      "__type",
      "children",
      "updatedAt"
    ]);

    category.DisplayOnMap = category.DisplayOnMap ? true : false;

    await networkService.send("updateCategory", category);
    category.section = dataService.findByAttribute(
      "sections",
      "objectId",
      category.section.objectId
    );
    dataService.updateById("categories", category.objectId, category);
  },
  createCategory: async formData => {
    let request = dataService.parseForm(
      [
        "name",
        "searchKeyword",
        "DetailsPageType",
        "PageDisplayType",
        "labelEn",
        "labelAr",
        "subtitleEn",
        "subtitleAr",
        "mapIcon",
        "DisplayOnMap",
        "childrenType",
        "section"
      ],
      formData
    );
    request.children = [];
    request.label = {
      en: request.labelEn,
      ar: request.labelAr
    };
    request.subTitle = {
      en: request.subtitleEn,
      ar: request.subtitleAr
    };
    request.section = {
      __type: "Pointer",
      className: "Sections",
      objectId: request.section
    };
    request.DisplayOnMap = request.DisplayOnMap === "" ? true : false;

    if (request.mapIcon) {
      if (request.mapIcon.name !== "") {
        request.mapIcon = await fileService.upload(request.mapIcon);
      } else delete request.mapIcon;
    }
    dataService.clearAttributes(request, [
      "subtitleEn",
      "subtitleAr",
      "labelAr",
      "labelEn",
      "className"
    ]);
    let response = await networkService.send("createCategory", request);
    request.objectId = response.data.objectId;
    request.createdAt = response.data.createdAt;
    request.section = dataService.findByAttribute(
      "sections",
      "objectId",
      request.section.objectId
    );
    dataService.saveOne("categories", request);
  },
  deleteCategory: async function(categoryId) {
    let category = dataService.findById("categories", categoryId);
    await networkService.send("deleteCategory", { id: category.objectId });
    dataService.deleteById("categories", category.objectId);
    if (category.childrenType === "subCategories")
      category.children.forEach(sub => {
        dataService.deleteById("subCategories", sub);
      });
  },
  insertChildLocally(catId, childId) {
    let cat = dataService.findById("categories", catId);
    cat.children.push(childId);
    dataService.updateById("categories", catId, cat);
  },
  deleteChildLocally(catId, childId) {
    let cat = dataService.findById("categories", catId);
    cat.children = cat.children.filter(child => {
      if (child !== childId) return child;
    });
    dataService.updateById("categories", catId, cat);
  },
  getSubCategoriesByChildId: (childId, type) => {
    let cats = dataService.load("categories");
    let result = [];
    cats.forEach(cat => {
      if (cat.childrenType === type && cat.children.includes(childId))
        result.push(cat);
    });
    return result;
  },

  // payload is an array of objects with the following structure:
  // {categoryId: string, sortOrder: number}
  updateCategorySortOrder: async payload => {
    await networkService.send("updateCategorySortOrder", payload);
    for (let item of payload) {
      let category = dataService.findById("categories", item.objectId);
      category.sortOrder = item.sortOrder;
      dataService.updateById("categories", item.objectId, category);
    }
    return true;
  }
};

export default categoryService;
