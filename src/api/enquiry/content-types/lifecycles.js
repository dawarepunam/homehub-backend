"use strict";

module.exports = {
    async afterCreate(event) {
        try {
            const { result } = event;

            // Enquiry मध्ये user relation मिळवणे
            const enquiry = await strapi
                .documents("api::enquiry.enquiry")
                .findOne({
                    documentId: result.documentId,
                    populate: {
                        users_permissions_user: true,
                        property: {
                            populate: {
                                Owner: true,
                            },
                        },
                    },
                });

            const userEmail = enquiry ? .users_permissions_user ? .email;
            const userName =
                enquiry ? .users_permissions_user ? .username ||
                enquiry ? .Name ||
                "User";

            const propertyTitle =
                enquiry ? .property ? .Title || "Property";

            // User email available नसेल तर email पाठवू नका
            if (!userEmail) {
                console.log("No user email found for enquiry.");
                return;
            }

            await strapi.plugin("email").service("email").send({
                to: userEmail,

                subject: "HomeHub - Enquiry Sent Successfully",

                text: `Hello ${userName},

Your enquiry has been successfully sent for the property:

${propertyTitle}

Thank you for using HomeHub.`,

                html: `
          <h2>HomeHub - Enquiry Sent Successfully</h2>

          <p>Hello <strong>${userName}</strong>,</p>

          <p>
            Your enquiry has been successfully sent for the following property:
          </p>

          <h3>${propertyTitle}</h3>

          <p>
            The property owner will be able to see your enquiry.
          </p>

          <p>
            Thank you for using <strong>HomeHub</strong>.
          </p>
        `,
            });

            console.log(
                `Enquiry email sent successfully to: ${userEmail}`
            );
        } catch (error) {
            console.error(
                "ENQUIRY EMAIL ERROR:",
                error
            );
        }
    },
};