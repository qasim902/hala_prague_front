import networkService from "./api.js";
import dataService from "./dataService.js";
import fileService from "./fileService.js";
import categoryService from "./categoryService.js";
import subCategoryService from "./subCategoryService.js";
import plannedTripsService from "./plannedTripsService.js";

const itemService = {
  createSectionItem: async ({
    formData,
    RichDescription,
    categories,
    subCategories,
    PageDispalyType
  }) => {
    let request = dataService.parseForm(
      [
        "TAreviewScore",
        "lat",
        "long",
        "infoEn",
        "infoAr",
        "labelEn",
        "labelAr",
        "price",
        "image",
        "phone",
        "website"
      ],
      formData
    );

    request.PageDispalyType = PageDispalyType;

    if (PageDispalyType === "bookingPage") {
      dataService.clearAttributes(request, [
        "TAreviewScore",
        "long",
        "lat",
        "price"
      ]);
    }

    if (request.image.name !== "")
      request.image = await fileService.upload(request.image);

    request.RichDescription = RichDescription;
    categories = categories.map(cat => {
      return cat.objectId;
    });
    subCategories = subCategories.map(subCat => {
      return subCat.objectId;
    });
    request.info = {
      en: request.infoEn,
      ar: request.infoAr
    };
    request.label = {
      en: request.labelEn,
      ar: request.labelAr
    };
    if (
      PageDispalyType === "standard" &&
      request.lat !== "" &&
      request.long !== ""
    )
      request.location = {
        __type: "GeoPoint",
        latitude: Number(request.lat),
        longitude: Number(request.long)
      };
    dataService.clearAttributes(request, [
      "infoEn",
      "infoAr",
      "labelEn",
      "labelAr",
      "lat",
      "long"
    ]);
    request.price = Number(request.price);
    request = {
      sectionItem: request,
      categories: categories,
      subCategories: subCategories
    };
    console.log(request);
    let response = await networkService.send("createSectionItem", request);
    let sectionItem = response.data.result;

    console.log(sectionItem);

    dataService.saveOne("sectionItems", sectionItem);

    for (let cat of categories)
      categoryService.insertChildLocally(cat, sectionItem.objectId);

    for (let sub of subCategories)
      subCategoryService.insertItemLocally(sub, sectionItem.objectId);
  },
  loadParents: items => {
    for (let item of items) {
      item.subCategories = subCategoryService
        .getSubCategoriesByItemId(item.objectId)
        .map(sub => {
          return { name: sub.name, objectId: sub.objectId };
        });

      item.categories = categoryService
        .getSubCategoriesByChildId(item.objectId, "sectionItems")
        .map(cat => {
          return { name: cat.name, objectId: cat.objectId };
        });
    }
  },
  updateSectionItem: async (editedItem, formData, RichDescription) => {
    let itemClone = { ...editedItem };

    dataService.clearAttributes(itemClone, [
      "createdAt",
      "updatedAt",
      "className",
      "__type",
      "categories",
      "subCategories"
    ]);
    console.log("itemClone3 =", itemClone);

    let data = dataService.parseForm(["image"], formData);
    if (data.image.name !== "") {
      itemClone.image = await fileService.upload(data.image);
    }

    itemClone.RichDescription = RichDescription;

    if (itemClone.PageDispalyType === "bookingPage") {
      dataService.clearAttributes(itemClone, [
        "TAreviewScore",
        "long",
        "lat",
        "price"
      ]);
    } else {
      itemClone.location.longitude = Number(itemClone.location.longitude);
      itemClone.location.latitude = Number(itemClone.location.latitude);
    }

    dataService.clearAttributes(itemClone, [
      "infoEn",
      "infoAr",
      "labelEn",
      "labelAr",
      "lat",
      "long"
    ]);

    itemClone.price = Number(itemClone.price);

    await networkService.send("updateSectionItem", itemClone);

    dataService.updateById("sectionItems", editedItem.objectId, itemClone);
  },
  deleteItem: async function(item) {
    item = { objectId: item };
    this.loadParents([item]);

    let subCategories = item.subCategories.map(sub => {
      return sub.objectId;
    });

    let categories = item.categories.map(cat => {
      return cat.objectId;
    });

    let plannedTrips = plannedTripsService.getItemTrips(item.objectId);

    let data = {
      id: item.objectId,
      subCategories: subCategories,
      categories: categories,
      plannedTrips: plannedTrips
    };

    await networkService.send("deleteSectionItem", data);

    //delete locally

    plannedTripsService.deleteSectionItem(item.objectId, plannedTrips);

    subCategories.forEach(sub => {
      subCategoryService.deleteItemLocally(sub, item.objectId);
    });

    categories.forEach(cat => {
      categoryService.deleteChildLocally(cat, item.objectId);
    });

    dataService.deleteById("sectionItems", item.objectId);
  }
};

export default itemService;
