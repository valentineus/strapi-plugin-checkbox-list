import type { ReactNode } from 'react';

import { Box, Field, MultiSelect, MultiSelectOption, Typography } from '@strapi/design-system';
import { useIntl } from 'react-intl';

type CheckboxListDefaultInputProps = {
  name: string;
  value?: unknown;
  onChange: (eventOrPath: { target: { name: string; value: string[] } }, value?: unknown) => void;
  intlLabel?: {
    id: string;
    defaultMessage: string;
    values?: Record<string, string | number | boolean | null | undefined>;
  };
  description?: {
    id: string;
    defaultMessage: string;
    values?: Record<string, string | number | boolean | null | undefined>;
  };
  labelAction?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  modifiedData?: {
    enum?: string[];
    options?: {
      enum?: string[];
    };
  };
};

const normalizeValue = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  if (typeof value === 'string' && value.length > 0) {
    return [value];
  }

  return [];
};

const CheckboxListDefaultInput = ({
  name,
  value,
  onChange,
  intlLabel,
  description,
  labelAction,
  required = false,
  disabled = false,
  error,
  modifiedData,
}: CheckboxListDefaultInputProps) => {
  const { formatMessage } = useIntl();
  const enumValues = Array.isArray(modifiedData?.options?.enum)
    ? modifiedData.options.enum
    : Array.isArray(modifiedData?.enum)
      ? modifiedData.enum
      : [];
  const selectedValues = normalizeValue(value);
  const uniqueValues = Array.from(
    new Set(enumValues.filter((option) => typeof option === 'string' && option.trim().length > 0))
  );

  const label = intlLabel
    ? formatMessage(intlLabel, intlLabel.values ?? {})
    : name;
  const hint = description ? formatMessage(description, description.values ?? {}) : undefined;

  const handleChange = (nextValues: string[] | undefined) => {
    onChange({
      target: {
        name,
        value: Array.isArray(nextValues) ? nextValues : [],
      },
    });
  };

  return (
    <Field.Root name={name} hint={hint} error={error} required={required}>
      <Field.Label action={labelAction}>{label}</Field.Label>
      {uniqueValues.length > 0 ? (
        <Box paddingTop={1}>
          <MultiSelect
            aria-label={label}
            disabled={disabled}
            id={name}
            name={name}
            onChange={handleChange}
            placeholder={formatMessage({
              id: 'checkbox-list.default.placeholder',
              defaultMessage: 'Select default values',
            })}
            value={selectedValues}
            withTags
          >
            {uniqueValues.map((option) => (
              <MultiSelectOption key={option} value={option}>
                {option}
              </MultiSelectOption>
            ))}
          </MultiSelect>
        </Box>
      ) : (
        <Box paddingTop={1}>
          <Typography variant="pi" textColor="neutral500">
            {formatMessage({
              id: 'checkbox-list.field.empty',
              defaultMessage: 'No values configured yet.',
            })}
          </Typography>
        </Box>
      )}
      <Field.Error />
      <Field.Hint />
    </Field.Root>
  );
};

export { CheckboxListDefaultInput };
