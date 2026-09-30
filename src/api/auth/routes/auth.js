
"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/auth/request-otp",
      handler: "auth.requestOtp",
      config: {
        auth: false,
      },
    },

    {
      method: "POST",
      path: "/auth/verify-otp",
      handler: "auth.verifyOtp",
      config: {
        auth: false,
      },
    },

    {
      method: "DELETE",
      path: "/auth/delete-account",
      handler: "auth.deleteAccount",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
