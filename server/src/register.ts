import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // register phase
  strapi.customFields.register({
    name: 'checkbox-list',
    plugin: 'checkbox-list',
    type: 'json',
    inputSize: {
      default: 6,
      isResizable: true,
    },
  });
};

export default register;
