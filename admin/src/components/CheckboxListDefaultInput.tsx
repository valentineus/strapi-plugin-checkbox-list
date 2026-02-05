import type { ReactNode } from 'react';

import { Box, Checkbox, Field, Flex, Typography } from '@strapi/design-system';
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
  const enumValues = Array.isArray(modifiedData?.enum) ? modifiedData.enum : [];
  const selectedValues = normalizeValue(value);

  const label = intlLabel
    ? formatMessage(intlLabel, intlLabel.values ?? {})
    : name;
  const hint = description ? formatMessage(description, description.values ?? {}) : undefined;

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
      <Field.Label action={labelAction}>{label}</Field.Label>
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

export { CheckboxListDefaultInput };
