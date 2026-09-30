"use strict";

module.exports = {
  async send(ctx) {
    try {
      // =====================================================
      // GET CURRENT LOGGED-IN USER
      // =====================================================

      const loggedInUser = ctx.state.user;

      if (!loggedInUser) {
        return ctx.unauthorized("Please login first.");
      }

      // =====================================================
      // GET USER EMAIL
      // =====================================================

      const userEmail = loggedInUser.email;

      if (!userEmail) {
        return ctx.badRequest("Logged-in user email was not found.");
      }

      // =====================================================
      // GET USERNAME
      // =====================================================

      const username = loggedInUser.username || "User";

      // =====================================================
      // SEND LOGIN EMAIL
      // =====================================================

      await strapi
        .plugin("email")
        .service("email")
        .send({
          to: userEmail,

          subject: "HomeHub - New Login Detected",

          text:
            `Hello ${username},\n\n` +
            `You have successfully logged in to your HomeHub account.\n\n` +
            `Login email: ${userEmail}\n\n` +
            `If this login was made by you, no action is required.\n\n` +
            `If you did not login to your account, please secure your account.\n\n` +
            `Regards,\n` +
            `HomeHub Team`,

          html: `
            <div
              style="
                font-family: Arial, sans-serif;
                line-height: 1.6;
                max-width: 600px;
                margin: 0 auto;
                padding: 30px;
                color: #1f2937;
              "
            >

              <h2 style="color: #2563eb;">
                HomeHub
              </h2>

              <h3>
                New Login Detected
              </h3>

              <p>
                Hello
                <strong>${username}</strong>,
              </p>

              <p>
                You have successfully logged in to your
                <strong>HomeHub</strong> account.
              </p>

              <div
                style="
                  background: #f3f4f6;
                  padding: 16px;
                  border-radius: 10px;
                  margin: 20px 0;
                "
              >
                <strong>Login Email:</strong>
                ${userEmail}
              </div>

              <p>
                If this login was made by you,
                no action is required.
              </p>

              <p>
                If you did not login to your account,
                please secure your account immediately.
              </p>

              <hr />

              <p
                style="
                  color: #6b7280;
                  font-size: 13px;
                "
              >
                This is an automated security
                notification from HomeHub.
              </p>

            </div>
          `,
        });

      // =====================================================
      // SUCCESS
      // =====================================================

      console.log("LOGIN EMAIL SENT TO:", userEmail);

      return ctx.send({
        success: true,
        message: "Login notification email sent successfully.",
      });
    } catch (error) {
      console.error("LOGIN EMAIL ERROR:", error);

      return ctx.internalServerError(
        "Unable to send login notification email.",
      );
    }
  },
};
