//* RENDERERS HOOK
// Usage: const { renderRateField, renderTextField, renderTextAreaField, renderButton, errorMessages } = useRenderers(props);

import { useCallback } from 'react';
import { TextInput, TextArea, Button } from '@sanity/ui';
import { set, unset } from 'sanity';
import { EditIcon } from '../icons/icons';

export const useRenderers = ({ value, onChange, members = [] }) => {

  // Reusable handler for all inputs
  const handleChange = useCallback(
    (fieldName, event) => {
      const nextValue = event.currentTarget.value;
      onChange(nextValue ? set(nextValue, [fieldName]) : unset([fieldName]));
    },
    [onChange],
  );

  // Helper to find validation error for a specific field
  const getFieldError = (fieldName) => {
    const member = members.find((m) => m.field?.id?.endsWith(fieldName));
    if (member && member.field?.validation) {
      return member.field.validation.find((v) => v.level === 'error');
    }
    return undefined;
  };

  // Helper to check if a field is focused (used by Presentation Tool for overlay navigation)
  const isFieldFocused = (fieldName) => {
    const member = members.find((m) => m.field?.id?.endsWith(fieldName));
    return member?.field?.focused ?? false;
  };

  //* RATE FIELD RENDERER
  const renderRateField = (fieldName, styleOverrides = {}) => {
    const error = getFieldError(fieldName);
    const focused = isFieldFocused(fieldName);
    return (
      <TextInput
        value={value?.[fieldName] || ''}
        onChange={(e) => handleChange(fieldName, e)}
        padding={3}
        placeholder="$0.00"
        radius={2}
        style={{
          textAlign: 'center',
          color: error ? 'red' : 'black',
          boxShadow: focused ? '0 0 0 2px var(--card-focus-ring-color, #2276fc)' : undefined,
          ...styleOverrides,
        }}
        tone={error ? 'critical' : 'default'}
        customValidity={error ? 'Invalid' : undefined}
      />
    );
  };

  //* TEXT FIELD RENDERER
  const renderTextField = (fieldName, className = '', padding = '4', styleOverrides = {}) => {
    const error = getFieldError(fieldName);
    const focused = isFieldFocused(fieldName);
    return (
      <TextInput
        value={value?.[fieldName] || ''}
        onChange={(e) => handleChange(fieldName, e)}
        className={className}
        padding={padding}
        radius={2}
        style={{
          textAlign: 'left',
          color: error ? 'red' : 'black',
          boxShadow: focused ? '0 0 0 2px var(--card-focus-ring-color, #2276fc)' : undefined,
          ...styleOverrides,
        }}
        tone={error ? 'critical' : 'default'}
        customValidity={error ? 'Invalid' : undefined}
      />
    );
  };

  //* TEXTAREA FIELD RENDERER
  const renderTextAreaField = (fieldName, className = '', styleOverrides = {}) => {
    const error = getFieldError(fieldName);
    const focused = isFieldFocused(fieldName);
    return (
      <TextArea
        className={className}
        value={value?.[fieldName] || ''}
        onChange={(e) => handleChange(fieldName, e)}
        radius={2}
        style={{
          textAlign: 'left',
          color: error ? 'red' : 'black',
          resize: 'vertical',
          boxShadow: focused ? '0 0 0 2px var(--card-focus-ring-color, #2276fc)' : undefined,
          ...styleOverrides,
        }}
        tone={error ? 'critical' : 'default'}
        customValidity={error ? 'Invalid' : undefined}
      />
    );
  };

  //* EDIT DEFINITION BUTTON RENDERER
  const renderButton = () => {
    return <Button fontSize={1} iconRight={EditIcon} padding={1} radius={2} />;
  };

  // Collect all unique error messages from members
  const errorMessages = [
    ...new Set(
      members
        .flatMap((m) => m.field?.validation || [])
        .filter((v) => v.level === 'error')
        .map((v) => v.message),
    ),
  ];

  return { renderRateField, renderTextField, renderTextAreaField, renderButton, errorMessages, isFieldFocused };
};
