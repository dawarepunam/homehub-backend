'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * Auto-grants Authenticated role access to the notification API
   * so users can fetch and update their own notifications.
   */
  async bootstrap({ strapi }) {
    try {
      // Get the Authenticated role
      const authenticatedRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'authenticated' }, populate: ['permissions'] });

      if (!authenticatedRole) return;

      // Build the notification permissions we need to grant
      const notificationActions = [
        'api::notification.notification.find',
        'api::notification.notification.findOne',
        'api::notification.notification.update',
      ];

      for (const action of notificationActions) {
        // Check if permission already exists
        const exists = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action, role: authenticatedRole.id } });

        if (!exists) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action,
              role: authenticatedRole.id,
            },
          });
          console.log(`[bootstrap] Granted permission: ${action}`);
        }
      }
    } catch (err) {
      // Don't fail startup if permissions bootstrap fails
      console.warn('[bootstrap] Could not set notification permissions:', err.message);
    }
    
    // Auto-populate User Site Settings Footer if empty
    try {
      const homeSettings = await strapi.documents('api::home-page.home-page').findFirst({
        populate: { Footer: { populate: '*' } }
      });

      if (homeSettings && homeSettings.Footer) {
        const cleanComponent = (obj) => {
          if (Array.isArray(obj)) return obj.map(cleanComponent);
          if (typeof obj === 'object' && obj !== null) {
            const newObj = {};
            for (const key in obj) {
              if (key !== 'id' && key !== 'documentId') {
                newObj[key] = cleanComponent(obj[key]);
              }
            }
            return newObj;
          }
          return obj;
        };

        const newFooter = cleanComponent(homeSettings.Footer);

        newFooter.PropertyLinks = [
          { Title: 'Saved Properties', Link: '/user/profile/saved-messages', IsActive: true, DisplayOrder: 1 },
          { Title: 'My Enquiries', Link: '/user/enquiries', IsActive: true, DisplayOrder: 2 },
          { Title: 'My Site Visits', Link: '/user/profile', IsActive: true, DisplayOrder: 3 },
          { Title: 'My Profile', Link: '/user/profile', IsActive: true, DisplayOrder: 4 }
        ];

        newFooter.QuickLinks = [
          { Title: 'Buy Property', Link: '/user/search?type=buy', IsActive: true, DisplayOrder: 1 },
          { Title: 'Rent Property', Link: '/user/search?type=rent', IsActive: true, DisplayOrder: 2 },
          { Title: 'New Projects', Link: '/user/search?category=new-projects', IsActive: true, DisplayOrder: 3 },
          { Title: 'Locality Insights', Link: '/locality-insights', IsActive: true, DisplayOrder: 4 },
          { Title: 'Property Guides', Link: '/property-guides', IsActive: true, DisplayOrder: 5 }
        ];

        const userSettingsList = await strapi.documents('api::user-site-setting.user-site-setting').findMany({ populate: '*' });
        if (userSettingsList && userSettingsList.length > 0) {
          const doc = userSettingsList[0];
          if (!doc.Footer) {
            await strapi.documents('api::user-site-setting.user-site-setting').update({
              documentId: doc.documentId,
              data: { Footer: newFooter },
              status: 'published'
            });
            console.log("[bootstrap] Successfully auto-populated Buyer Footer from Home Page Footer.");
          }
        }
      }
    } catch (err) {
      console.warn('[bootstrap] Could not populate Footer:', err.message);
    }
  },
};
