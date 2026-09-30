'use strict';

module.exports = {
  async getStats(ctx) {
    try {
      const { documentId } = ctx.params;
      
      // Get Views
      const views = await strapi.entityService.findMany('api::property-view.property-view', {
        filters: { property: { documentId: documentId } },
        populate: ['viewer']
      });

      // Get Enquiries
      const enquiries = await strapi.entityService.findMany('api::enquiry.enquiry', {
        filters: { property: { documentId: documentId } },
        populate: ['users_permissions_user']
      });

      // Get Saves (Wishlist logic)
      const userProfiles = await strapi.entityService.findMany('api::user-profile.user-profile', {
        populate: {
          users_permissions_user: true,
          Wishlist: {
            populate: {
              properties: true
            }
          }
        }
      });

      const savers = [];
      if (userProfiles) {
        for (const profile of userProfiles) {
          const wishlist = profile.Wishlist?.[0] || profile.Wishlist;
          if (!wishlist) continue;
          
          const props = wishlist.properties || [];
          const hasProp = props.some(p => String(p.documentId) === String(documentId) || String(p.id) === String(documentId));
          
          if (hasProp && profile.users_permissions_user) {
            savers.push({
              ...profile.users_permissions_user,
              attributes: profile.users_permissions_user,
              saveDate: profile.updatedAt || profile.createdAt
            });
          }
        }
      }

      ctx.body = {
        views: views || [],
        enquiries: enquiries || [],
        saves: savers || []
      };
    } catch (err) {
      ctx.body = { views: [], enquiries: [], saves: [], error: err.message };
    }
  }
};
