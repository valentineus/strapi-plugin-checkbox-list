import slugify from '@sindresorhus/slugify';
import { translatedErrors } from '@strapi/admin/strapi-admin';
import * as yup from 'yup';

const GRAPHQL_ENUM_REGEX = /^[_A-Za-z][_0-9A-Za-z]*$/;

const toRegressedEnumValue = (value?: string) => {
  if (!value) {
    return '';
  }

  return slugify(value, {
    decamelize: false,
    lowercase: false,
    separator: '_',
  });
};

const hasUniqueValues = (values: string[]) => {
  const seen = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      return false;
    }

    seen.add(value);
  }

  return true;
};

export const checkboxListOptionsValidator = () => ({
  enum: yup
    .array()
    .of(yup.string())
    .min(1, translatedErrors.min.id)
    .test({
      name: 'areEnumValuesUnique',
      message: 'content-type-builder.error.validation.enum-duplicate',
      test(values) {
        if (!values) {
          return false;
        }

        const normalizedValues = values.map(toRegressedEnumValue);

        return hasUniqueValues(normalizedValues);
      },
    })
    .test({
      name: 'doesNotHaveEmptyValues',
      message: 'content-type-builder.error.validation.enum-empty-string',
      test(values) {
        if (!values) {
          return false;
        }

        return !values.map(toRegressedEnumValue).some((value) => value === '');
      },
    })
    .test({
      name: 'doesMatchRegex',
      message: 'content-type-builder.error.validation.enum-regex',
      test(values) {
        if (!values) {
          return false;
        }

        return values.map(toRegressedEnumValue).every((value) => GRAPHQL_ENUM_REGEX.test(value));
      },
    }),
  enumName: yup.string().nullable(),
});
