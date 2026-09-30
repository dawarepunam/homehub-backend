module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/properties/stats/:documentId',
      handler: 'custom-property.getStats',
      config: {
        auth: false,
      },
    },
  ],
};
