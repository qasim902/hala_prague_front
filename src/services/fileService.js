import networkService from "./api.js";

const fileService = {
  upload: async function(file) {
    console.log(file);
    let imgUploaded = await networkService.send("fileUpload", {
      name: file.name.split(" ").join(""),
      data: file
    });
    console.log(imgUploaded.data.url, "imgUploadedimgUploadeddata");
    let imgName = imgUploaded.data.url.split("/");
    console.log(imgName);
    imgName = imgName[imgName.length - 1];
    return {
      __type: "File",
      name: imgName,
      url: imgUploaded.data.url
    };
  }
};

export default fileService;
