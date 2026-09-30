'use strict';

/**
 * tool-setting service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tool-setting.tool-setting');
