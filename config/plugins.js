// // const allowedMediaTypes = [
// //   'image/*',
// //   'video/*',
// //   'audio/*',
// //   'application/pdf',
// //   'application/msword',
// //   'application/vnd.openxmlformats-officedocument.*',
// //   'text/plain',
// //   'text/csv',
// // ];

// // const deniedExecutableTypes = [
// //   'application/vnd.microsoft.portable-executable',
// //   'application/x-msdownload',
// //   'application/x-msdos-program',
// //   'application/x-executable',
// //   'application/x-dosexec',
// //   'application/x-sh',
// //   'text/x-shellscript',
// //   'application/x-mach-binary',
// // ];

// // module.exports = () => ({
// //   'users-permissions': {
// //     config: {
// //       jwtManagement: 'refresh',
// //       sessions: {
// //         httpOnly: true,
// //       },
// //     },
// //   },
// //   upload: {
// //     config: {
// //       security: {
// //         allowedTypes: allowedMediaTypes,
// //         deniedTypes: deniedExecutableTypes,
// //       },
// //     },
// //   },
// // });
// const allowedMediaTypes = [
//     "image/*",
//     "video/*",
//     "audio/*",
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.*",
//     "text/plain",
//     "text/csv",
// ];

// const deniedExecutableTypes = [
//     "application/vnd.microsoft.portable-executable",
//     "application/x-msdownload",
//     "application/x-msdos-program",
//     "application/x-executable",
//     "application/x-dosexec",
//     "application/x-sh",
//     "text/x-shellscript",
//     "application/x-mach-binary",
// ];

// module.exports = () => ({
//     // =====================================================
//     // EMAIL
//     // =====================================================

//     email: {
//         config: {
//             provider: "nodemailer",

//             providerOptions: {
//                 host: process.env.SMTP_HOST || "smtp.gmail.com",
//                 port: Number(process.env.SMTP_PORT) || 465,
//                 secure: true,

//                 auth: {
//                     user: process.env.SMTP_USERNAME,
//                     pass: process.env.SMTP_PASSWORD,
//                 },
//             },

//             settings: {
//                 defaultFrom: process.env.SMTP_FROM,
//                 defaultReplyTo: process.env.SMTP_REPLY_TO,
//             },
//         },
//     },

//     // =====================================================
//     // UPLOAD SECURITY
//     // =====================================================

//     upload: {
//         config: {
//             security: {
//                 allowedTypes: allowedMediaTypes,
//                 deniedTypes: deniedExecutableTypes,
//             },
//         },
//     },
// });

const allowedMediaTypes = [
  "image/*",
  "video/*",
  "audio/*",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.*",
  "text/plain",
  "text/csv",
];

const deniedExecutableTypes = [
  "application/vnd.microsoft.portable-executable",
  "application/x-msdownload",
  "application/x-msdos-program",
  "application/x-executable",
  "application/x-dosexec",
  "application/x-sh",
  "text/x-shellscript",
  "application/x-mach-binary",
];

module.exports = () => ({
  // =====================================================
  // EMAIL CONFIGURATION
  // =====================================================

  email: {
    config: {
      provider: "nodemailer",

      providerOptions: {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,

        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },

      settings: {
        defaultFrom: process.env.SMTP_FROM,
        defaultReplyTo: process.env.SMTP_REPLY_TO,
      },
    },
  },

  // =====================================================
  // UPLOAD SECURITY
  // =====================================================

  upload: {
    config: {
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes: deniedExecutableTypes,
      },
    },
  },
});
