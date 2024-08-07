import networkService from "./api.js";
import dataService from "./dataService.js";
import fileService from "./fileService.js";

const subCategoryService = {
  updateSubCategory: async (subCategory, formData) => {
    let { img } = dataService.parseForm(["img"], formData);
    console.log("subCategory: ", subCategory, " img: ", img);
    let subCategoryClone = { ...subCategory };

    dataService.clearAttributes(subCategoryClone, [
      "img",
      "createdAt",
      "updatedAt",
      "sectionItems",
      "category",
      "__type",
      "className"
    ]);

    if (img.name !== "") {
      subCategory.img = await fileService.upload(img);
      subCategoryClone.img = subCategory.img;
    }

    subCategory.DisplayOnMap = subCategory.DisplayOnMap ? true : false;
    subCategoryClone.DisplayOnMap = subCategory.DisplayOnMap;

    await networkService.send("updateSubCategory", subCategoryClone);
    dataService.updateById("subCategories", subCategory.objectId, subCategory);
  },
  createSubCategory: async formData => {
    let request = dataService.parseForm(
      [
        "name",
        "searchKeyword",
        "DetailsPageType",
        "labelEn",
        "labelAr",
        "subtitleEn",
        "subtitleAr",
        "img",
        "DisplayOnMap",
        "category"
      ],
      formData
    );

    request.DisplayOnMap = request.DisplayOnMap === "" ? true : false;

    request.label = {
      en: request.labelEn,
      ar: request.labelAr
    };
    request.subTitle = {
      en: request.subtitleEn,
      ar: request.subtitleAr
    };

    if (request.img.name !== "") {
      request.img = await fileService.upload(request.img);
    } else delete request.img;

    let category = dataService.findById("categories", request.category);
    request = { subCategory: request };

    dataService.clearAttributes(request, ["className"]);
    let response = await networkService.send("createSubCategory", request);
    let subCategory = response.data.result;
    dataService.saveOne("subCategories", subCategory);
    category.children.push(subCategory.objectId);
    dataService.updateById("categories", category.objectId, category);
  },
  getCategory: subCategory => {
    let categories = dataService.load("categories");
    for (let category of categories)
      if (category.childrenType == "subCategories")
        if (
          category.children.length > 0 &&
          category.children.includes(subCategory.objectId)
        )
          subCategory.category = category;
  },
  getCategories: function(subCategories) {
    for (let subCategory of subCategories) this.getCategory(subCategory);
  },
  deleteSubCategory: async subCategory => {
    console.log(subCategory);
    let category = subCategory.category;

    await networkService.send("deleteSubCategory", {
      categoryId: category.objectId,
      subCategoryId: subCategory.objectId
    });
    dataService.deleteById("subCategories", subCategory.objectId);
    category.children.splice(
      category.children.indexOf(subCategory.objectId),
      1
    );
    dataService.updateById("categories", category.objectId, category);
  },
  insertItemLocally(subId, itemId) {
    let sub = dataService.findById("subCategories", subId);
    sub.sectionItems.push(itemId);
    dataService.updateById("subCategories", subId, sub);
  },
  deleteItemLocally(subId, itemId) {
    let sub = dataService.findById("subCategories", subId);
    sub.sectionItems = sub.sectionItems.filter(item => {
      if (itemId !== item) return item;
    });
    dataService.updateById("subCategories", subId, sub);
  },
  getSubCategoriesByItemId: itemId => {
    let subCats = dataService.load("subCategories");
    let result = [];
    subCats.forEach(subCat => {
      if (subCat.sectionItems.includes(itemId)) result.push(subCat);
    });
    return result;
  }
};

export default subCategoryService;
