import { EnumerationField } from '@strapi/icons/symbols';
import { Initializer } from './components/Initializer';
import { CheckboxListDefaultInput } from './components/CheckboxListDefaultInput';
import { PLUGIN_ID } from './pluginId';

export default {
  register(app: any) {
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });

    const ctbPlugin = app.getPlugin?.('content-type-builder');

    if (ctbPlugin?.apis?.forms?.components?.add) {
      ctbPlugin.apis.forms.components.add({
        id: 'checkbox-list-default',
        component: CheckboxListDefaultInput,
      });
    }

    app.customFields.register({
      name: 'checkbox-list',
      pluginId: PLUGIN_ID,
      type: 'json',
      icon: EnumerationField,
      intlLabel: {
        id: `${PLUGIN_ID}.customField.label`,
        defaultMessage: 'Checkbox list',
      },
      intlDescription: {
        id: `${PLUGIN_ID}.customField.description`,
        defaultMessage: 'Select multiple values from a list',
      },
      components: {
        Input: async () => {
          const { default: Component } = await import('./components/CheckboxListInput');

          return { default: Component };
        },
      },
      options: {
        base: [
          {
            sectionTitle: null,
            items: [
              {
                name: 'enum',
                type: 'textarea-enum',
                size: 6,
                intlLabel: {
                  id: 'form.attribute.item.enumeration.rules',
                  defaultMessage: 'Values (one line per value)',
                },
                placeholder: {
                  id: 'form.attribute.item.enumeration.placeholder',
                  defaultMessage: 'Ex:\nmorning\nnoon\nevening',
                },
                validations: {
                  required: true,
                },
              },
            ],
          },
        ],
        advanced: [
          {
            sectionTitle: null,
            items: [
              {
                name: 'default',
                type: 'checkbox-list-default',
                size: 6,
                intlLabel: {
                  id: 'form.attribute.settings.default',
                  defaultMessage: 'Default value',
                },
                validations: {},
              },
              {
                name: 'options.enumName',
                type: 'text',
                size: 6,
                intlLabel: {
                  id: 'form.attribute.item.enumeration.graphql',
                  defaultMessage: 'Name override for GraphQL',
                },
                description: {
                  id: 'form.attribute.item.enumeration.graphql.description',
                  defaultMessage: 'Allows you to override the default generated name for GraphQL',
                },
                validations: {},
              },
            ],
          },
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: 'form.attribute.item.requiredField',
                  defaultMessage: 'Required field',
                },
                description: {
                  id: 'form.attribute.item.requiredField.description',
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
              {
                name: 'private',
                type: 'checkbox',
                intlLabel: {
                  id: 'form.attribute.item.privateField',
                  defaultMessage: 'Private field',
                },
                description: {
                  id: 'form.attribute.item.privateField.description',
                  defaultMessage: 'This field will not show up in the API response',
                },
              },
            ],
          },
        ],
      },
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
