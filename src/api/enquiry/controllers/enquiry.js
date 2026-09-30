"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::enquiry.enquiry",
  function ({ strapi }) {
    return {
      async create(ctx) {
        // =====================================================
        // 1. CHECK LOGIN
        // =====================================================

        const loggedInUser = ctx.state.user;

        if (!loggedInUser) {
          return ctx.unauthorized("Please login first.");
        }

        // =====================================================
        // 2. CREATE ENQUIRY IN DATABASE FIRST
        // The DB record must succeed before anything else.
        // Email failures must NEVER roll back a successful creation.
        // =====================================================

        let response;
        try {
          response = await super.create(ctx);
        } catch (createErr) {
          console.error("ENQUIRY CREATE DB ERROR:", createErr);
          return ctx.internalServerError("Unable to create enquiry.");
        }

        console.log("====================================");
        console.log("ENQUIRY CREATED SUCCESSFULLY IN DB");
        console.log("USER ID:", loggedInUser.id);
        console.log("USER EMAIL:", loggedInUser.email);
        console.log("====================================");

        // =====================================================
        // 3. POST-CREATION: EMAILS & NOTIFICATIONS
        // All of this runs AFTER the enquiry is saved.
        // Any failure here must NOT affect the API response.
        // =====================================================

        try {
          const userEmail = loggedInUser.email;
          if (!userEmail) {
            console.log("Buyer email not found — skipping all emails.");
            return response;
          }

          // =====================================================
          // 4. FIND USER PROFILE (for notification preferences)
          // =====================================================

          let emailNotifications = true;
          let enquiryUpdates = true;

          try {
            const userProfile = await strapi.db
              .query("api::user-profile.user-profile")
              .findOne({
                where: { users_permissions_user: loggedInUser.id },
                populate: { NotificationPreferences: true },
              });

            if (userProfile && userProfile.NotificationPreferences) {
              if (userProfile.NotificationPreferences.EmailNotifications !== undefined) {
                emailNotifications = userProfile.NotificationPreferences.EmailNotifications;
              }
              if (userProfile.NotificationPreferences.EnquiryUpdates !== undefined) {
                enquiryUpdates = userProfile.NotificationPreferences.EnquiryUpdates;
              }
            }
          } catch (profileErr) {
            console.error("Error fetching user profile (non-fatal):", profileErr);
          }

          console.log("Email Notifications:", emailNotifications);
          console.log("Enquiry Updates:", enquiryUpdates);

          if (emailNotifications !== true || enquiryUpdates !== true) {
            console.log("Emails disabled by user preferences — skipping.");
            return response;
          }

          // =====================================================
          // 5. READ REQUEST DATA
          // =====================================================

          let requestData = {};
          if (ctx.request && ctx.request.body && ctx.request.body.data) {
            requestData = ctx.request.body.data;
          }

          // =====================================================
          // 6. GET PROPERTY ID FROM REQUEST
          // =====================================================

          let propertyId = null;

          if (requestData.property) {
            if (typeof requestData.property === "number") {
              propertyId = requestData.property;
            } else if (typeof requestData.property === "object") {
              if (requestData.property.id) {
                propertyId = requestData.property.id;
              } else if (
                requestData.property.connect &&
                Array.isArray(requestData.property.connect) &&
                requestData.property.connect.length > 0
              ) {
                const connection = requestData.property.connect[0];
                if (typeof connection === "number") {
                  propertyId = connection;
                } else if (connection && typeof connection === "object" && connection.id) {
                  propertyId = connection.id;
                }
              }
            }
          }

          console.log("PROPERTY ID:", propertyId);

          // =====================================================
          // 7. FETCH PROPERTY + OWNER EMAIL
          // We need: Title, Area, City, and the Owner's email
          // =====================================================

          let propertyTitle = "Property";
          let propertyLocation = "";
          let ownerEmail = null;
          let ownerUsername = null;

          if (propertyId) {
            try {
              const property = await strapi.db
                .query("api::property.property")
                .findOne({
                  where: { id: propertyId },
                  select: ["Title", "Area", "City"],
                  populate: { Owner: true },
                });

              if (property) {
                if (property.Title) propertyTitle = property.Title;
                const locationParts = [property.Area, property.City].filter(Boolean);
                if (locationParts.length) propertyLocation = locationParts.join(", ");

                if (property.Owner) {
                  ownerEmail = property.Owner.email || null;
                  ownerUsername = property.Owner.username || null;
                }
              }
            } catch (propErr) {
              console.error("Error fetching property/owner details (non-fatal):", propErr);
            }
          }

          console.log("PROPERTY TITLE:", propertyTitle);
          console.log("OWNER EMAIL:", ownerEmail ? "(found)" : "(not found)");

          // Enquiry details for emails
          const buyerName = requestData.Name || loggedInUser.username || "A buyer";
          const buyerPhone = requestData.Phone || "Not provided";
          const buyerEmailAddr = requestData.Email || loggedInUser.email || "Not provided";
          const enquiryMessage = requestData.Message || "No message provided.";
          const isVisit = enquiryMessage.toLowerCase().startsWith("schedule a visit");

          // =====================================================
          // 8. SEND BUYER CONFIRMATION EMAIL (non-fatal)
          // =====================================================

          try {
            await strapi.plugin("email").service("email").send({
              to: userEmail,
              subject: isVisit
                ? "HomeHub - Site Visit Request Sent"
                : "HomeHub - Enquiry Sent Successfully",
              text:
                "Hello " + (loggedInUser.username || "User") + ",\n\n" +
                (isVisit
                  ? "Your site visit request has been sent to the property owner.\n\n"
                  : "Your enquiry has been successfully sent on HomeHub.\n\n") +
                "Property: " + propertyTitle + "\n" +
                (propertyLocation ? "Location: " + propertyLocation + "\n" : "") +
                "\nThe owner has been notified and will respond to your enquiry.\n\n" +
                "Thank you for using HomeHub.\n\nRegards,\nHomeHub Team",
              html:
                '<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:25px;color:#333;line-height:1.6;">' +
                '<h2 style="color:#064d3b;">HomeHub</h2>' +
                "<h3>" + (isVisit ? "Site Visit Request Sent" : "Enquiry Sent Successfully") + "</h3>" +
                "<p>Hello <strong>" + (loggedInUser.username || "User") + "</strong>,</p>" +
                "<p>" + (isVisit
                  ? "Your site visit request has been sent to the property owner."
                  : "Your enquiry has been successfully sent on HomeHub.") + "</p>" +
                '<div style="background:#f8fafc;padding:15px;border-radius:10px;margin:20px 0;">' +
                '<p style="margin:0;"><strong>Property:</strong> ' + propertyTitle + "</p>" +
                (propertyLocation ? '<p style="margin:4px 0 0;"><strong>Location:</strong> ' + propertyLocation + "</p>" : "") +
                "</div>" +
                "<p>The owner has been notified and will respond to your enquiry.</p>" +
                "<p>Thank you for using <strong>HomeHub</strong>.</p>" +
                '<hr style="border:none;border-top:1px solid #ddd;margin:25px 0;" />' +
                '<p style="font-size:12px;color:#777;">This is an automated email from HomeHub.</p>' +
                "</div>",
            });
            console.log("BUYER EMAIL SENT TO:", userEmail);
          } catch (buyerEmailErr) {
            // Email failure MUST NOT break enquiry creation — only log
            console.error("BUYER EMAIL ERROR (non-fatal):", buyerEmailErr);
          }

          // =====================================================
          // 9. SEND OWNER NOTIFICATION EMAIL (non-fatal)
          // Notify the property owner about the new enquiry.
          // =====================================================

          if (ownerEmail) {
            try {
              await strapi.plugin("email").service("email").send({
                to: ownerEmail,
                replyTo: buyerEmailAddr,
                subject: isVisit
                  ? "New Site Visit Request for Your Property | HomeHub"
                  : "New Enquiry Received for Your Property | HomeHub",
                text:
                  "Hello " + (ownerUsername || "Owner") + ",\n\n" +
                  (isVisit
                    ? "A buyer has requested a site visit for your property.\n\n"
                    : "You have received a new property enquiry on HomeHub.\n\n") +
                  "Property Details\n----------------\n" +
                  "Property: " + propertyTitle + "\n" +
                  (propertyLocation ? "Location: " + propertyLocation + "\n" : "") +
                  "\nEnquirer Details\n----------------\n" +
                  "Name: " + buyerName + "\n" +
                  "Phone: " + buyerPhone + "\n" +
                  "Email: " + buyerEmailAddr + "\n" +
                  "\nMessage\n-------\n" + enquiryMessage + "\n\n" +
                  "Please log in to your HomeHub Seller account to view and manage this enquiry.\n\nRegards,\nHomeHub Team",
                html:
                  '<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:25px;color:#333;line-height:1.6;background:#faf8f5;">' +
                  '<h2 style="color:#064d3b;">HomeHub</h2>' +
                  "<h3>" + (isVisit ? "New Site Visit Request" : "New Enquiry Received for Your Property") + "</h3>" +
                  "<p>Hello <strong>" + (ownerUsername || "Owner") + "</strong>,</p>" +
                  "<p>" + (isVisit
                    ? "A buyer has requested a site visit for your property."
                    : "You have received a new property enquiry on HomeHub.") + "</p>" +
                  '<div style="background:#fff;padding:15px;border-radius:10px;margin:20px 0;border-left:4px solid #064d3b;">' +
                  '<p style="margin:0 0 8px;font-weight:bold;color:#064d3b;">Property Details</p>' +
                  '<p style="margin:4px 0;"><strong>Property:</strong> ' + propertyTitle + "</p>" +
                  (propertyLocation ? '<p style="margin:4px 0;"><strong>Location:</strong> ' + propertyLocation + "</p>" : "") +
                  "</div>" +
                  '<div style="background:#fff;padding:15px;border-radius:10px;margin:20px 0;border-left:4px solid #c99838;">' +
                  '<p style="margin:0 0 8px;font-weight:bold;color:#064d3b;">Enquirer Details</p>' +
                  '<p style="margin:4px 0;"><strong>Name:</strong> ' + buyerName + "</p>" +
                  '<p style="margin:4px 0;"><strong>Email:</strong> ' + buyerEmailAddr + "</p>" +
                  '<p style="margin:4px 0;"><strong>Phone:</strong> ' + buyerPhone + "</p>" +
                  "</div>" +
                  '<div style="background:#fff;padding:15px;border-radius:10px;margin:20px 0;border-left:4px solid #064d3b;">' +
                  '<p style="margin:0 0 8px;font-weight:bold;color:#064d3b;">Message</p>' +
                  '<p style="margin:0;">' + enquiryMessage + "</p>" +
                  "</div>" +
                  "<p>Please log in to your HomeHub Seller account to view and manage this enquiry.</p>" +
                  '<hr style="border:none;border-top:1px solid #ddd;margin:25px 0;" />' +
                  '<p style="font-size:12px;color:#777;">This is an automated email from HomeHub Team.</p>' +
                  "</div>",
              });
              console.log("OWNER EMAIL SENT TO:", ownerEmail);
            } catch (ownerEmailErr) {
              // Email failure MUST NOT break enquiry creation — only log
              console.error("OWNER EMAIL ERROR (non-fatal):", ownerEmailErr);
            }
          } else {
            console.log("Owner email not found — skipping owner notification.");
          }

          // =====================================================
          // 10. SEND ADMIN NOTIFICATION EMAIL (non-fatal)
          // =====================================================

          const adminEmail = process.env.ADMIN_EMAIL;
          if (adminEmail) {
            try {
              await strapi.plugin("email").service("email").send({
                to: adminEmail,
                replyTo: buyerEmailAddr,
                subject: "New Property Enquiry Received | HomeHub",
                text:
                  "Hello HomeHub Administration,\n\n" +
                  "A new property enquiry has been received.\n\n" +
                  "Enquiry Details\n---------------\n" +
                  "Property: " + propertyTitle + "\n" +
                  (propertyLocation ? "Location: " + propertyLocation + "\n" : "") +
                  "Buyer: " + buyerName + "\n" +
                  "Buyer Email: " + buyerEmailAddr + "\n" +
                  "Buyer Phone: " + buyerPhone + "\n" +
                  "Message: " + enquiryMessage + "\n" +
                  "Enquiry Status: Pending\n" +
                  "Enquiry Date: " + new Date().toLocaleString() + "\n\n" +
                  "Please review this enquiry from the HomeHub Administration panel.\n\nRegards,\nHomeHub System",
                html:
                  '<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:25px;color:#333;line-height:1.6;background:#faf8f5;">' +
                  '<h2 style="color:#064d3b;">HomeHub</h2>' +
                  "<h3>New Property Enquiry Received</h3>" +
                  "<p>Hello HomeHub Administration,</p>" +
                  "<p>A new property enquiry has been received.</p>" +
                  '<div style="background:#fff;padding:15px;border-radius:10px;margin:20px 0;border-left:4px solid #c99838;">' +
                  '<p style="margin:0 0 8px;font-weight:bold;color:#064d3b;">Enquiry Details</p>' +
                  '<p style="margin:4px 0;"><strong>Property:</strong> ' + propertyTitle + "</p>" +
                  (propertyLocation ? '<p style="margin:4px 0;"><strong>Location:</strong> ' + propertyLocation + "</p>" : "") +
                  '<p style="margin:4px 0;"><strong>Buyer:</strong> ' + buyerName + "</p>" +
                  '<p style="margin:4px 0;"><strong>Buyer Email:</strong> ' + buyerEmailAddr + "</p>" +
                  '<p style="margin:4px 0;"><strong>Buyer Phone:</strong> ' + buyerPhone + "</p>" +
                  '<p style="margin:4px 0;"><strong>Message:</strong> ' + enquiryMessage + "</p>" +
                  '<p style="margin:4px 0;"><strong>Enquiry Status:</strong> Pending</p>' +
                  '<p style="margin:4px 0;"><strong>Enquiry Date:</strong> ' + new Date().toLocaleString() + "</p>" +
                  "</div>" +
                  "<p>Please review this enquiry from the HomeHub Administration panel.</p>" +
                  '<hr style="border:none;border-top:1px solid #ddd;margin:25px 0;" />' +
                  '<p style="font-size:12px;color:#777;">This is an automated email from HomeHub System.</p>' +
                  "</div>",
              });
              console.log("ADMIN EMAIL SENT TO:", adminEmail);
            } catch (adminEmailErr) {
              console.error("ADMIN EMAIL ERROR (non-fatal):", adminEmailErr);
            }
          } else {
            console.log("ADMIN_EMAIL not set in .env — skipping admin notification.");
          }

        } catch (postCreateErr) {
          // Catch-all: enquiry already created — just log and return
          console.error("POST-CREATION ERROR (non-fatal, enquiry was saved):", postCreateErr);
        }

        return response;
      },

      async update(ctx) {
        const loggedInUser = ctx.state.user;
        if (!loggedInUser) {
          return ctx.unauthorized("Please login first.");
        }

        const documentId = ctx.params.documentId || ctx.params.id;
        
        let oldEnquiry = null;
        try {
          oldEnquiry = await strapi.documents("api::enquiry.enquiry").findOne({
            documentId,
          });
        } catch (e) {
          console.error("Error fetching old enquiry state:", e);
        }
        
        const oldStatus = oldEnquiry?.Statuss ? oldEnquiry.Statuss.trim() : "";

        const response = await super.update(ctx);

        try {
          const enquiry = await strapi.documents("api::enquiry.enquiry").findOne({
            documentId,
            populate: {
              users_permissions_user: true,
              property: {
                populate: { Owner: true }
              }
            }
          });

          if (!enquiry || !enquiry.users_permissions_user) return response;

          const newStatus = enquiry.Statuss;
          const cleanStatus = newStatus ? newStatus.trim() : "";
          
          if (!cleanStatus) return response;
          if (oldStatus === cleanStatus) {
            console.log("Status unchanged (", cleanStatus, ") - skipping duplicate notifications.");
            return response;
          }
          
          // Only send emails for relevant owner-triggered statuses
          // IMPORTANT: schema has whitespace quirks (' Confirmed', 'Cancelled ')
          // so we include both the trimmed AND the exact schema enum values.
          const notifyStatuses = [
            "Contacted", "Confirmed", " Confirmed",
            "Cancelled", "Cancelled ",
            "Rescheduled", "Completed", "Closed",
            "Site Visit", "Interested", "Not Interested"
          ];
          
          if (!notifyStatuses.includes(cleanStatus) && !notifyStatuses.includes(newStatus)) return response;

          const buyer = enquiry.users_permissions_user;
          const property = enquiry.property;
          const propertyTitle = property ? property.Title : "a property";
          const propertyArea = property ? (property.Area || "") : "";
          const propertyCity = property ? (property.City || "") : "";
          const propertyLocation = [propertyArea, propertyCity].filter(Boolean).join(", ");

          // Format visit date if available
          let visitDateStr = "";
          if (enquiry.VisitDate) {
            try {
              const d = new Date(enquiry.VisitDate);
              visitDateStr = d.toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric", weekday: "short"
              }) + " at " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
            } catch(e) { /* ignore */ }
          }

          const notificationTitle = "Enquiry Updated";
          const notificationMessage = `The owner has marked your enquiry as ${cleanStatus}.`;

          // Create notification (non-fatal)
          // Type enum values in schema: "Enquiry", "Site Visit", "Property", "System"
          try {
            const notifType = (
              cleanStatus === "Site Visit" ||
              cleanStatus === "Confirmed" || cleanStatus === " Confirmed" ||
              cleanStatus === "Cancelled" || cleanStatus === "Cancelled " ||
              cleanStatus === "Rescheduled" || cleanStatus === "Completed"
            ) ? "Site Visit" : "Enquiry";

            await strapi.db.query("api::notification.notification").create({
              data: {
                Title: notificationTitle,
                Message: notificationMessage,
                Type: notifType,
                users_permissions_user: buyer.id,
                property: property ? property.id : null,
                enquiry: enquiry.id,
                IsRead: false
              }
            });
            console.log("BUYER NOTIFICATION CREATED for user:", buyer.id, "status:", cleanStatus);
          } catch(notifErr) {
            console.error("Error creating notification (non-fatal):", notifErr);
          }

          // Send email to buyer (non-fatal)
          if (buyer.email) {
            try {
              const ownerEmail = property?.Owner?.email || null;
              const buyerMessage = enquiry.Message || "No message provided.";
              
              let subjectText = `Your HomeHub enquiry has been updated`;
              let headerText = `Your Enquiry Has Been Updated`;
              let introText = `Your enquiry has been updated to ${cleanStatus}.`;
              let footerText = ``;
              let isVisitAction = false;
              let showMessage = false;

              switch(cleanStatus) {
                case "Contacted":
                  subjectText = "Your HomeHub Enquiry Has Been Received";
                  headerText = "Your Enquiry Has Been Received";
                  introText = "Thank you for your enquiry on HomeHub. The property owner/seller has reviewed your enquiry and has marked it as contacted.";
                  footerText = "The seller may contact you using the phone number or email address provided with your enquiry.";
                  showMessage = true;
                  break;
                case "Site Visit":
                  subjectText = "Site Visit Scheduled | HomeHub";
                  headerText = "Site Visit Scheduled";
                  introText = "Your site visit has been scheduled for the following property.";
                  footerText = "Please keep this information for your visit.";
                  isVisitAction = true;
                  break;
                case "Confirmed":
                case " Confirmed":  // Strapi schema enum quirk: leading space
                  subjectText = "Site Visit Confirmed | HomeHub";
                  headerText = "Site Visit Confirmed";
                  introText = "Your site visit has been confirmed by the property owner.";
                  isVisitAction = true;
                  break;
                case "Rescheduled":
                  subjectText = "Site Visit Rescheduled | HomeHub";
                  headerText = "Site Visit Rescheduled";
                  introText = "Your scheduled site visit has been rescheduled by the property owner.";
                  isVisitAction = true;
                  break;
                case "Cancelled":
                case "Cancelled ":  // Strapi schema enum quirk: trailing space
                  subjectText = "Site Visit Cancelled | HomeHub";
                  headerText = "Site Visit Cancelled";
                  introText = "Your scheduled site visit for this property has been cancelled.";
                  footerText = "Please contact HomeHub if you need further assistance.";
                  isVisitAction = true;
                  break;
                case "Completed":
                  subjectText = "Site Visit Completed | HomeHub";
                  headerText = "Site Visit Completed";
                  introText = "Your site visit for this property has been marked as completed.";
                  isVisitAction = true;
                  break;
                case "Closed":
                  subjectText = "Your HomeHub Enquiry Has Been Closed";
                  headerText = "Enquiry Closed";
                  introText = "Your enquiry for this property has been closed by the property owner.";
                  break;
                case "Interested":
                case "Not Interested":
                  subjectText = `Your HomeHub Enquiry Update: ${cleanStatus}`;
                  headerText = "Enquiry Updated";
                  introText = `The owner has marked your enquiry as ${cleanStatus}.`;
                  break;
              }

              let emailText = `Hello ${buyer.username || "User"},\n\n${introText}\n\n` +
                  `Property Details\n----------------\n` +
                  `Property: ${propertyTitle}\n` +
                  (propertyLocation ? `Location: ${propertyLocation}\n` : "") +
                  `\nEnquiry Status: ${cleanStatus}\n\n`;
              
              if (isVisitAction && visitDateStr) {
                emailText += `Visit Date & Time\n-----------------\nDate & Time: ${visitDateStr}\n\n`;
              }
              if (showMessage) {
                emailText += `Your Message\n------------\n${buyerMessage}\n\n`;
              }
              if (footerText) {
                emailText += `${footerText}\n\n`;
              }
              emailText += `Regards,\nHomeHub Team`;

              let emailHtml = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:25px;color:#333;line-height:1.6;background:#faf8f5;">' +
                  '<h2 style="color:#064d3b;">HomeHub</h2>' +
                  `<h3>${headerText}</h3>` +
                  `<p>Hello <strong>${buyer.username || "User"}</strong>,</p>` +
                  `<p>${introText}</p>` +
                  '<div style="background:#fff;padding:15px;border-radius:10px;margin:20px 0;border-left:4px solid #064d3b;">' +
                  '<p style="margin:0 0 8px;font-weight:bold;color:#064d3b;">Property Details</p>' +
                  `<p style="margin:4px 0;"><strong>Property:</strong> ${propertyTitle}</p>` +
                  (propertyLocation ? `<p style="margin:4px 0;"><strong>Location:</strong> ${propertyLocation}</p>` : "") +
                  '</div>';
                  
              if (isVisitAction && visitDateStr) {
                emailHtml += '<div style="background:#fff;padding:15px;border-radius:10px;margin:20px 0;border-left:4px solid #c99838;">' +
                  '<p style="margin:0 0 8px;font-weight:bold;color:#064d3b;">Visit Date & Time</p>' +
                  `<p style="margin:4px 0;"><strong>Date & Time:</strong> ${visitDateStr}</p>` +
                  '</div>';
              }
              if (showMessage) {
                emailHtml += '<div style="background:#fff;padding:15px;border-radius:10px;margin:20px 0;border-left:4px solid #c99838;">' +
                  '<p style="margin:0 0 8px;font-weight:bold;color:#064d3b;">Your Message</p>' +
                  `<p style="margin:0;">${buyerMessage}</p>` +
                  '</div>';
              }
              
              emailHtml += '<div style="background:#fff;padding:15px;border-radius:10px;margin:20px 0;border-left:4px solid ' + (isVisitAction ? '#c99838' : '#064d3b') + ';">' +
                  '<p style="margin:0 0 8px;font-weight:bold;color:#064d3b;">Status</p>' +
                  `<p style="margin:4px 0;"><strong>Status:</strong> ${cleanStatus}</p>` +
                  '</div>';
                  
              if (footerText) {
                emailHtml += `<p>${footerText}</p>`;
              }
              emailHtml += '<p>Regards,<br><strong>HomeHub Team</strong></p>' +
                  '<hr style="border:none;border-top:1px solid #ddd;margin:25px 0;" />' +
                  '<p style="font-size:12px;color:#777;">This is an automated email from HomeHub.</p>' +
                  "</div>";

              await strapi.plugin("email").service("email").send({
                to: buyer.email,
                ...(ownerEmail ? { replyTo: ownerEmail } : {}),
                subject: subjectText,
                text: emailText,
                html: emailHtml
              });
              console.log("UPDATE EMAIL SENT TO:", buyer.email, "STATUS:", cleanStatus);
            } catch(emailErr) {
              console.error("[Enquiry Email] Failed to send Buyer email (non-fatal):", emailErr);
            }
          }

        } catch (err) {
          console.error("Error in update controller notification logic (non-fatal):", err);
        }

        return response;
      },

      async delete(ctx) {
        // Strapi v5 uses documentId in route params (not numeric id)
        const documentId = ctx.params.documentId || ctx.params.id;
        const loggedInUser = ctx.state.user;

        if (!loggedInUser) {
          return ctx.unauthorized("Please login first.");
        }

        if (!documentId) {
          return ctx.badRequest("Enquiry documentId is required.");
        }

        try {
          // Strapi v5: use strapi.documents() instead of strapi.entityService
          const enquiry = await strapi.documents("api::enquiry.enquiry").findOne({
            documentId,
            populate: ["users_permissions_user"]
          });

          if (!enquiry) {
            return ctx.notFound("Enquiry not found");
          }

          // Verify the enquiry belongs to the logged-in user
          if (
            enquiry.users_permissions_user?.id &&
            enquiry.users_permissions_user.id !== loggedInUser.id
          ) {
            return ctx.unauthorized("You cannot delete this enquiry.");
          }

          // Soft delete — set BuyerDeleted = true instead of hard delete
          // This preserves the record for the Owner while hiding it from the Buyer
          const updated = await strapi.documents("api::enquiry.enquiry").update({
            documentId,
            data: { BuyerDeleted: true }
          });

          return { data: updated };
        } catch (error) {
          console.error("ENQUIRY SOFT-DELETE ERROR:", error);
          return ctx.internalServerError("Unable to remove enquiry.");
        }
      }
    };
  },
);
