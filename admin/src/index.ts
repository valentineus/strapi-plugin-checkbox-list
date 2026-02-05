import { Check } from '@strapi/icons';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import { PLUGIN_ID } from './pluginId';
import { getTranslation } from './utils/getTranslation';

export default {
  register(app: any) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID,
      },
      Component: async () => {
        const { App } = await import('./pages/App');

        return App;
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });

    app.customFields.register({
      name: 'checkbox-list',
      pluginId: PLUGIN_ID,
      type: 'json',
      icon: Check,
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
