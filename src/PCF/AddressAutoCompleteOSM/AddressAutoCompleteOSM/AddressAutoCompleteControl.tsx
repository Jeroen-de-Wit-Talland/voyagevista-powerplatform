import * as React from 'react';
import { Button, Input, Listbox, Option, Spinner, Text } from '@fluentui/react-components';
import { IAddressSuggestion, searchAddresses } from './nominatimClient';

export interface IAddressAutoCompleteProps {
  address?: string;
  disabled?: boolean;
  onChange: (address: string) => void;
}

const MIN_QUERY_LENGTH = 3;

export const AddressAutoComplete: React.FC<IAddressAutoCompleteProps> = ({ address, disabled, onChange }) => {
  const [text, setText] = React.useState(address ?? '');
  const [suggestions, setSuggestions] = React.useState<IAddressSuggestion[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();
  const abortRef = React.useRef<AbortController | undefined>();

  // Keep local text in sync when the form changes the bound value.
  React.useEffect(() => {
    setText(address ?? '');
  }, [address]);

  React.useEffect(() => () => abortRef.current?.abort(), []);

  const search = async (): Promise<void> => {
    const query = text.trim();
    if (query.length < MIN_QUERY_LENGTH) {
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(undefined);
    try {
      setSuggestions(await searchAddresses(query, controller.signal));
    } catch (e) {
      if (!controller.signal.aborted) {
        setError('Address lookup failed.');
        setSuggestions([]);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const select = (value: string): void => {
    setText(value);
    setSuggestions([]);
    onChange(value);
  };

  return (
    <div style={{ width: '100%' }}>
      <Input
        style={{ width: '100%' }}
        value={text}
        disabled={disabled}
        placeholder="Type an address and press Enter"
        onChange={(_e, data) => setText(data.value)}
        onBlur={() => onChange(text)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            void search();
          }
        }}
        contentAfter={
          loading ? (
            <Spinner size="tiny" />
          ) : (
            <Button appearance="transparent" size="small" disabled={disabled} onClick={() => void search()}>
              Search
            </Button>
          )
        }
      />
      {error && <Text role="alert">{error}</Text>}
      {suggestions.length > 0 && (
        <Listbox onOptionSelect={(_e, data) => data.optionText && select(data.optionText)}>
          {suggestions.map((s) => (
            <Option key={s.id} text={s.displayName}>
              {s.displayName}
            </Option>
          ))}
        </Listbox>
      )}
    </div>
  );
};
