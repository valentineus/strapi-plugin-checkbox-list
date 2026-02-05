import type { ReactNode } from 'react';

import { Box, Checkbox, Field, Flex, Typography } from '@strapi/design-system';
import { useIntl } from 'react-intl';

type CheckboxListInputProps = {
  name: string;
  value?: unknown;
  onChange: (eventOrPath: { target: { name: string; value: string[] } }, value?: unknown) => void;
  attribute?: {
    enum?: string[];
    options?: {
      enum?: string[];
    };
  } | null;
  label?: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  labelAction?: ReactNode;
};

const getEnumValues = (attribute: CheckboxListInputProps['attribute']): string[] => {
  if (!attribute) {
    return [];
  }

  if (Array.isArray(attribute.options?.enum)) {
    return attribute.options.enum;
  }

  if (Array.isArray(attribute.enum)) {
    return attribute.enum;
  }

  return [];
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

const CheckboxListInput = ({
  name,
  value,
  onChange,
  attribute,
  label,
  hint,
  required = false,
  disabled = false,
  error,
  labelAction,
}: CheckboxListInputProps) => {
  const { formatMessage } = useIntl();
  const enumValues = getEnumValues(attribute);
  const selectedValues = normalizeValue(value);

  const handleToggle = (option: string, isChecked: boolean) => {
    const nextValues = isChecked
      ? Array.from(new Set([...selectedValues, option]))
      : selectedValues.filter((item) => item !== option);

    onChange({
      target: {
        name,
        value: nextValues,
      },
    });
  };

  return (
    <Field.Root name={name} hint={hint} error={error} required={required}>
      <Field.Label action={labelAction}>{label ?? name}</Field.Label>
      {enumValues.length > 0 ? (
        <Flex direction="column" gap={2} paddingTop={1} alignItems="flex-start">
          {enumValues.map((option) => (
            <Checkbox
              key={option}
              checked={selectedValues.includes(option)}
              disabled={disabled}
              onCheckedChange={(checked: boolean | 'indeterminate') =>
                handleToggle(option, Boolean(checked))
              }
            >
              {option}
            </Checkbox>
          ))}
        </Flex>
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

export default CheckboxListInput;
