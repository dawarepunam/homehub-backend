"use strict";

module.exports = {
  // =====================================================
  // REQUEST OTP
  // =====================================================
  async requestOtp(ctx) {
    try {
      const {
        role,
        method,
        mobile,
        email,
      } = ctx.request.body || {};

      // ---------------------------------------------
      // BASIC VALIDATION
      // ---------------------------------------------

      if (!role) {
        return ctx.badRequest("Role is required.");
      }

      if (!method) {
        return ctx.badRequest(
          "Authentication method is required."
        );
      }

      if (!["user", "owner"].includes(role)) {
        return ctx.badRequest(
          "Role must be either user or owner."
        );
      }

      if (!["mobile", "email"].includes(method)) {
        return ctx.badRequest(
          "Method must be mobile or email."
        );
      }

      // =================================================
      // MOBILE OTP
      // =================================================

      if (method === "mobile") {
        if (!mobile) {
          return ctx.badRequest(
            "Mobile number is required."
          );
        }

        const cleanMobile = String(mobile).replace(
          /\D/g,
          ""
        );

        if (cleanMobile.length !== 10) {
          return ctx.badRequest(
            "Please enter a valid 10-digit mobile number."
          );
        }

        // Generate 6 digit OTP
        const otp = Math.floor(
          100000 + Math.random() * 900000
        ).toString();

        // Temporary OTP storage
        global.mobileOtps =
          global.mobileOtps || {};

        global.mobileOtps[cleanMobile] = {
          otp,
          role,
          expiresAt:
            Date.now() + 5 * 60 * 1000,
        };

        // ---------------------------------------------
        // DEVELOPMENT ONLY
        // ---------------------------------------------
        // Real SMS provider will be connected later.
        console.log(
          "===================================="
        );
        console.log("HOMEHUB MOBILE OTP");
        console.log("Mobile:", cleanMobile);
        console.log("Role:", role);
        console.log("OTP:", otp);
        console.log(
          "Expires:",
          new Date(
            global.mobileOtps[cleanMobile]
              .expiresAt
          ).toLocaleString()
        );
        console.log(
          "===================================="
        );

        return ctx.send({
          success: true,
          method: "mobile",
          message:
            "OTP generated successfully.",
        });
      }

      // =================================================
      // EMAIL OTP
      // =================================================

      if (method === "email") {
        if (!email) {
          return ctx.badRequest(
            "Email address is required."
          );
        }

        const cleanEmail = String(email)
          .trim()
          .toLowerCase();

        const emailRegex =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
          return ctx.badRequest(
            "Please enter a valid email address."
          );
        }

        // Generate 6 digit OTP
        const otp = Math.floor(
          100000 + Math.random() * 900000
        ).toString();

        // Temporary OTP storage
        global.emailOtps =
          global.emailOtps || {};

        global.emailOtps[cleanEmail] = {
          otp,
          role,
          expiresAt:
            Date.now() + 5 * 60 * 1000,
        };

        // ---------------------------------------------
        // SEND EMAIL USING STRAPI EMAIL PLUGIN
        // ---------------------------------------------

        try {
          await strapi
            .plugin("email")
            .service("email")
            .send({
              to: cleanEmail,
              subject:
                "Your HomeHub Verification OTP",
              text:
                `Your HomeHub verification OTP is ${otp}. ` +
                `This OTP is valid for 5 minutes.`,
              html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                  <h2 style="color: #176b4d;">
                    HomeHub Verification
                  </h2>

                  <p>
                    Hello,
                  </p>

                  <p>
                    Your verification OTP for
                    <strong>HomeHub</strong> is:
                  </p>

                  <div
                    style="
                      font-size: 32px;
                      font-weight: bold;
                      letter-spacing: 8px;
                      margin: 20px 0;
                      color: #176b4d;
                    "
                  >
                    ${otp}
                  </div>

                  <p>
                    This OTP is valid for
                    <strong>5 minutes</strong>.
                  </p>

                  <p>
                    If you did not request this OTP,
                    please ignore this email.
                  </p>

                  <p>
                    Regards,<br />
                    <strong>HomeHub Team</strong>
                  </p>
                </div>
              `,
            });

          console.log(
            "HomeHub email OTP sent to:",
            cleanEmail
          );
        } catch (emailError) {
          console.error(
            "Email sending failed:",
            emailError
          );

          return ctx.internalServerError(
            "Unable to send OTP email. Please check Strapi email configuration."
          );
        }

        return ctx.send({
          success: true,
          method: "email",
          message:
            "OTP has been sent to your email address.",
        });
      }

      return ctx.badRequest(
        "Invalid authentication method."
      );
    } catch (error) {
      console.error(
        "Request OTP Error:",
        error
      );

      return ctx.internalServerError(
        "Unable to process OTP request."
      );
    }
  },

  // =====================================================
  // VERIFY OTP
  // =====================================================
  async verifyOtp(ctx) {
    try {
      const {
        role,
        method,
        mobile,
        email,
        otp,
      } = ctx.request.body || {};

      // ---------------------------------------------
      // BASIC VALIDATION
      // ---------------------------------------------

      if (!role) {
        return ctx.badRequest(
          "Role is required."
        );
      }

      if (!method) {
        return ctx.badRequest(
          "Authentication method is required."
        );
      }

      if (!otp) {
        return ctx.badRequest(
          "OTP is required."
        );
      }

      const cleanOtp = String(otp).replace(
        /\D/g,
        ""
      );

      if (cleanOtp.length !== 6) {
        return ctx.badRequest(
          "OTP must contain 6 digits."
        );
      }

      // =================================================
      // MOBILE OTP VERIFICATION
      // =================================================

      if (method === "mobile") {
        if (!mobile) {
          return ctx.badRequest(
            "Mobile number is required."
          );
        }

        const cleanMobile = String(
          mobile
        ).replace(/\D/g, "");

        const storedOtp =
          global.mobileOtps?.[cleanMobile];

        if (!storedOtp) {
          return ctx.badRequest(
            "OTP not found. Please request a new OTP."
          );
        }

        // Check expiration
        if (
          Date.now() >
          storedOtp.expiresAt
        ) {
          delete global.mobileOtps[
            cleanMobile
          ];

          return ctx.badRequest(
            "OTP has expired. Please request a new OTP."
          );
        }

        // Check OTP
        if (storedOtp.otp !== cleanOtp) {
          return ctx.badRequest(
            "Invalid OTP. Please try again."
          );
        }

        // Remove used OTP
        delete global.mobileOtps[
          cleanMobile
        ];

        console.log(
          "Mobile OTP verified:",
          cleanMobile
        );

        return ctx.send({
          success: true,
          verified: true,
          method: "mobile",
          role,
          message:
            "Mobile number verified successfully.",
        });
      }

      // =================================================
      // EMAIL OTP VERIFICATION
      // =================================================

      if (method === "email") {
        if (!email) {
          return ctx.badRequest(
            "Email address is required."
          );
        }

        const cleanEmail = String(email)
          .trim()
          .toLowerCase();

        const storedOtp =
          global.emailOtps?.[cleanEmail];

        if (!storedOtp) {
          return ctx.badRequest(
            "OTP not found. Please request a new OTP."
          );
        }

        // Check expiration
        if (
          Date.now() >
          storedOtp.expiresAt
        ) {
          delete global.emailOtps[
            cleanEmail
          ];

          return ctx.badRequest(
            "OTP has expired. Please request a new OTP."
          );
        }

        // Check OTP
        if (storedOtp.otp !== cleanOtp) {
          return ctx.badRequest(
            "Invalid OTP. Please try again."
          );
        }

        // Remove used OTP
        delete global.emailOtps[
          cleanEmail
        ];

        const user = await strapi
          .query(
            "plugin::users-permissions.user"
          )
          .findOne({
            where: {
              email: cleanEmail,
            },
          });

        if (!user) {
          return ctx.badRequest(
            "No account found with this email address."
          );
        }

        if (user.blocked) {
          return ctx.badRequest(
            "This account is blocked."
          );
        }

        const token = strapi
          .plugin("users-permissions")
          .service("jwt")
          .issue({
            id: user.id,
          });

        const sanitizedUser = {
          id: user.id,
          documentId: user.documentId,
          username: user.username,
          email: user.email,
          provider: user.provider,
          confirmed: user.confirmed,
          blocked: user.blocked,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };

        console.log(
          "Email OTP verified:",
          cleanEmail
        );

        return ctx.send({
          success: true,
          verified: true,
          method: "email",
          role,
          token,
          user: sanitizedUser,
          message:
            "Email address verified successfully.",
        });
      }

      return ctx.badRequest(
        "Invalid authentication method."
      );
    } catch (error) {
      console.error(
        "Verify OTP Error:",
        error
      );

      return ctx.internalServerError(
        "Unable to verify OTP."
      );
    }
  },

  // =====================================================
  // DELETE ACCOUNT
  // =====================================================
  async deleteAccount(ctx) {
    try {
      // 1. Get logged-in user from JWT
      const authUser = ctx.state.user;

      if (!authUser || !authUser.id) {
        return ctx.unauthorized(
          "You must be logged in to delete your account."
        );
      }

      const userId = authUser.id;

      // 2. Delete related User Profile (if exists)
      try {
        const profiles = await strapi
          .query("api::user-profile.user-profile")
          .findMany({
            where: {
              users_permissions_user: { id: userId },
            },
          });

        for (const profile of profiles) {
          await strapi
            .query("api::user-profile.user-profile")
            .delete({ where: { id: profile.id } });
        }
      } catch (profileErr) {
        console.error("Delete profile error (non-fatal):", profileErr);
      }

      // 3. Delete the auth user itself
      await strapi
        .query("plugin::users-permissions.user")
        .delete({ where: { id: userId } });

      console.log(`HomeHub: User account deleted — userId: ${userId}`);

      return ctx.send({
        success: true,
        message: "Account deleted successfully.",
      });
    } catch (error) {
      console.error("Delete Account Error:", error);
      return ctx.internalServerError(
        "Unable to delete account. Please try again."
      );
    }
  },
};
