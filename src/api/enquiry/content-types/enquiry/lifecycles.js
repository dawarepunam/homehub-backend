'use strict';

module.exports = {
  async afterCreate(event) {
    const { result, params } = event;
    const strapi = global.strapi;

    try {
      // Fetch full enquiry to get the property and its owner
      const enquiry = await strapi.entityService.findOne('api::enquiry.enquiry', result.id, {
        populate: ['property', 'property.Owner', 'users_permissions_user']
      });

      if (!enquiry || !enquiry.property) return;

      const propertyTitle = enquiry.property.Title || 'a property';
      const owner = enquiry.property.Owner;
      const buyer = enquiry.users_permissions_user;

      // 1. Notify the Seller
      if (owner) {
        await strapi.entityService.create('api::notification.notification', {
          data: {
            Title: 'New Enquiry',
            Message: `You received a new enquiry for "${propertyTitle}" from ${enquiry.Name || 'a buyer'}.`,
            Type: 'Enquiry',
            IsRead: false,
            Link: `/owner/enquiries/${enquiry.documentId || enquiry.id}`,
            users_permissions_user: owner.id,
            property: enquiry.property.id,
            enquiry: enquiry.id,
            publishedAt: new Date()
          }
        });
      }

      // 2. Notify the Buyer
      if (buyer) {
        await strapi.entityService.create('api::notification.notification', {
          data: {
            Title: 'Enquiry Sent',
            Message: `Your enquiry for "${propertyTitle}" has been sent successfully.`,
            Type: 'Enquiry',
            IsRead: false,
            Link: `/user/enquiries/${enquiry.documentId || enquiry.id}`,
            users_permissions_user: buyer.id,
            property: enquiry.property.id,
            enquiry: enquiry.id,
            publishedAt: new Date()
          }
        });
      }
    } catch (err) {
      console.error('Error generating notification on enquiry creation:', err);
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;
    const strapi = global.strapi;

    try {
      const enquiry = await strapi.entityService.findOne('api::enquiry.enquiry', result.id, {
        populate: ['property', 'property.Owner', 'users_permissions_user']
      });

      if (!enquiry || !enquiry.property) return;

      const propertyTitle = enquiry.property.Title || 'a property';
      const buyer = enquiry.users_permissions_user;
      
      if (!buyer) return; // Only notify if it's a registered buyer

      // Check if status changed
      const status = enquiry.Statuss;
      
      let title = null;
      let message = null;
      let type = 'Enquiry';

      // Status-based notifications
      if (status === 'Scheduled') {
        title = 'Site Visit Scheduled';
        message = `Your site visit for "${propertyTitle}" has been scheduled.`;
        type = 'Site Visit';
      } else if (status === ' Confirmed') {
        title = 'Site Visit Confirmed';
        message = `Your site visit for "${propertyTitle}" has been confirmed.`;
        type = 'Site Visit';
      } else if (status === 'Rescheduled') {
        title = 'Site Visit Rescheduled';
        message = `Your site visit for "${propertyTitle}" has been rescheduled.`;
        type = 'Site Visit';
      } else if (status === 'Cancelled ') {
        title = 'Site Visit Cancelled';
        message = `Your site visit for "${propertyTitle}" has been cancelled.`;
        type = 'Site Visit';
      } else if (status === 'Completed') {
        title = 'Site Visit Completed';
        message = `Your site visit for "${propertyTitle}" has been completed.`;
        type = 'Site Visit';
      } else if (status === 'Closed') {
        title = 'Enquiry Closed';
        message = `Your enquiry for "${propertyTitle}" has been closed.`;
      } else if (status === 'Contacted' || status === 'Responded') {
        title = 'Enquiry Update';
        message = `The seller has updated your enquiry for "${propertyTitle}". Status: ${status}`;
      }

      // If owner response was added (this requires keeping track of previous state, but we'll approximate it here if it exists and status is updated)
      // Note: Strapi event.params.data contains the updated fields.
      if (params.data.OwnerResponse) {
        title = 'Enquiry Update';
        message = `The seller has responded to your enquiry for "${propertyTitle}".`;
        type = 'Enquiry';
      }

      if (title && message) {
        await strapi.entityService.create('api::notification.notification', {
          data: {
            Title: title,
            Message: message,
            Type: type,
            IsRead: false,
            Link: `/user/enquiries/${enquiry.documentId || enquiry.id}`,
            users_permissions_user: buyer.id,
            property: enquiry.property.id,
            enquiry: enquiry.id,
            publishedAt: new Date()
          }
        });
      }
    } catch (err) {
      console.error('Error generating notification on enquiry update:', err);
    }
  }
};
