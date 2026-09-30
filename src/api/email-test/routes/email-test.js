"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/email-test/send",
      handler: "email-test.send",
      config: {
        auth: {},
      },
    },
  ],
};
