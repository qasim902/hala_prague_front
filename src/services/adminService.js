import networkService from "./api.js";
import dataService from "./dataService.js";

const adminService = {
  login: async (email, password) => {
    let response = await networkService.send("login", { email, password });
    response = response.data.result;
    if (response.msg) return response;
    dataService.save("verificationCode", response.verificationCode);
    dataService.save("email", email);
  },

  verifyOtp: async otp => {
    let verificationCode = dataService.load("verificationCode");
    let response = await networkService.send("verifyOtp", {
      otp,
      verificationCode
    });
    response = response.data.result;
    if (response.msg) return response;
    localStorage.removeItem("verificationCode");
    localStorage.removeItem("email");

    dataService.save("masterKey", response.masterKey);
    dataService.save("admin", response.admin);

    let dashboardData = await networkService.send("dashboard", null);
    dashboardData = dashboardData.data.result;
    dataService.saveDashboardData(dashboardData);
  }
};

export default adminService;
