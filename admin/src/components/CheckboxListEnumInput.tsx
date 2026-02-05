import type { ChangeEvent, ReactNode } from 'react';

import { Field, Textarea } from '@strapi/design-system';
import { useIntl } from 'react-intl';

type CheckboxListEnumInputProps = {
  name: string;
  value?: unknown;
  onChange: (eventOrPath: { target: { name: string; value: string[] } }, value?: unknown) => void;
  intlLabel: {
    id: string;
    defaultMessage: string;
    values?: Record<string, string | number | boolean | null | undefined>;
  };
  description?: {
    id: string;
    defaultMessage: string;
    values?: Record<string, string | number | boolean | null | undefined>;
  } | null;
  labelAction?: ReactNode;
  placeholder?: {
    id: string;
    defaultMessage: string;
    values?: Record<string, string | number | boolean | null | undefined>;
  } | null;
  disabled?: boolean;
  error?: string;
  modifiedData?: {
    enum?: string[];
    options?: {
      enum?: string[];
    };
  };
};

const normalizeEnum = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  return [];
};

const CheckboxListEnumInput = ({
  description = null,
  disabled = false,
  error = '',
  intlLabel,
  labelAction,
  name,
  onChange,
  placeholder = null,
  value,
  modifiedData,
}: CheckboxListEnumInputProps) => {
  const { formatMessage } = useIntl();

  const fallbackEnum = normalizeEnum(modifiedData?.enum);
  const resolvedEnum = normalizeEnum(value).length > 0 ? normalizeEnum(value) : fallbackEnum;

  const errorMessage = error
    ? formatMessage({
        id: error,
        defaultMessage: error,
      })
    : '';

  const hint = description
    ? formatMessage(
        {
          id: description.id,
          defaultMessage: description.defaultMessage,
        },
        description.values
      )
    : '';

  const label = formatMessage(intlLabel, intlLabel.values ?? {});
  const formattedPlaceholder = placeholder
    ? formatMessage(
        {
          id: placeholder.id,
          defaultMessage: placeholder.defaultMessage,
        },
        placeholder.values
      )
    : '';

  const inputValue = resolvedEnum.join('\n');

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const arrayValue = event.target.value.split('\n');

    onChange({
      target: {
        name,
        value: arrayValue,
      },
    });

    if (name !== 'enum') {
      onChange({
        target: {
          name: 'enum',
          value: arrayValue,
        },
      });
    }
  };

  return (
    <Field.Root error={errorMessage} hint={hint} name={name}>
      <Field.Label action={labelAction}>{label}</Field.Label>
      <Textarea
        disabled={disabled}
        onChange={handleChange}
        placeholder={formattedPlaceholder}
        value={inputValue}
      />
      <Field.Error />
      <Field.Hint />
    </Field.Root>
  );
};

export { CheckboxListEnumInput };
