'use strict';

/**
 * notification controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::notification.notification', ({ strapi }) => ({
  async find(ctx) {
    // Only return notifications belonging to the authenticated user
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized("You must be logged in to access notifications.");
    }

    ctx.query = {
      ...ctx.query,
      filters: {
        ...ctx.query.filters,
        users_permissions_user: user.id
      }
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  }
}));
