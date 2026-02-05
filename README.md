# Strapi Checkbox List Plugin

A custom field plugin for Strapi v5 that extends the Content Type Builder with a flexible checkbox list component. Enable content editors to select multiple values from predefined options with an intuitive interface that seamlessly integrates into the Strapi admin panel.

## Features

- **Multi-select interface**: Intuitive checkbox-based selection for content editors
- **Flexible configuration**: Define custom option lists for each field instance
- **Native integration**: Works seamlessly within Strapi's Content Type Builder
- **Type-safe**: Full TypeScript support for enhanced development experience

## Requirements

- Node.js and npm compatible with Strapi v5

## Installation

Install the package in your Strapi project:

```bash
npm install strapi-plugin-checkbox-list
```

Restart your Strapi application, then navigate to the Content Type Builder to add the **Checkbox list** custom field to your content types.

## Usage

After installation, the Checkbox list field type will be available in the Content Type Builder:

1. Open Content Type Builder
2. Select a content type or create a new one
3. Click "Add another field"
4. Choose "Checkbox list" from the custom fields
5. Configure your checkbox options
6. Save and use in your content entries

## Contributing & Support

This project is actively maintained and welcomes contributions. Issues and pull requests can be submitted through either repository:

- **Primary development**: [valentineus/strapi-plugin-checkbox-list](https://code.popov.link/valentineus/strapi-plugin-checkbox-list/issues)
- **GitHub mirror**: [valentineus/strapi-plugin-checkbox-list](https://github.com/valentineus/strapi-plugin-checkbox-list/issues)

Development primarily takes place on the self-hosted Git instance, with GitHub serving as a mirror for broader accessibility.

**Maintainer**: Valentin Popov <valentin@popov.link>

## Development

Build the plugin:

```bash
npm install
npm run build
```

For active development with automatic rebuilds:

```bash
npm run watch
```

To run the test Strapi app from `playground/`:

```bash
cd playground
npm install
npm run develop
```

If you need the plugin linked into the playground app, use the Strapi plugin linker and point it at `playground/`:

```bash
npm run watch:link
```

## License

This project is licensed under the [MIT License](LICENSE.txt).
