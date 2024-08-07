const dataService = {
  save: (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  load: key => {
    return JSON.parse(localStorage.getItem(key));
  },
  saveDashboardData: function(data) {
    console.log(data, 'datadatadatadatadatadatadatadata');
    for (let category of data.categories)
      for (let section of data.sections)
        if (section.objectId === category.section.objectId)
          category.section = section;

    this.save("advertisementBanners", data.advertisementBanners);
    this.save("sections", data.sections);
    this.save("categories", data.categories);
    this.save("subCategories", data.subCategories);
    this.save("sectionItems", data.sectionItems);
    this.save("plannedTrips", data.plannedTrips);
    this.save("contacts", data.contacts);
    this.save("embassies", data.embassies);
    this.save("staticPages", data.staticPages);
  },
  findByAttribute: function(collection, attr, value) {
    let collectionObj = this.load(collection);
    for (let item of collectionObj) if (item[attr] == value) return item;
  },
  saveOne: function(key, obj) {
    let collection = this.load(key);
    collection.push(obj);
    this.save(key, collection);
  },
  findById: function(collection, id) {
    return this.findByAttribute(collection, "objectId", id);
  },

  updateById: function(key, id, obj) {
    let collection = this.load(key);
    for (let item of collection) {
      if (item.objectId === id) {
        for (let attr in obj) {
          item[attr] = obj[attr];
        }
        this.save(key, collection);
        return true;
      }
    }
    return false;
  },

  parseForm: (fields, formData) => {
    let result = {};
    for (let field of fields) {
      result[field] = formData.get(field);
    }
    return result;
  },
  deleteById: function(key, id) {
    let collection = this.load(key);
    collection = collection.filter(obj => {
      return obj.objectId !== id;
    });
    this.save(key, collection);
  },
  clearAttributes(obj, attributes) {
    for (let attr of attributes) delete obj[attr];
  }
};

export default dataService;
