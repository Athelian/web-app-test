// @flow
import React, { useRef, useEffect } from 'react';
import { useIntl } from 'react-intl';
import Dialog from 'components/Dialog';
import InputWrapper from '../InputWrapper';
import TextAreaInputDialog from './TextAreaInputDialog';

type Props = {
  value: string | null,
  onChange: string => void,
  focus: boolean,
  readonly: boolean,
  onFocus: Function,
  onBlur: Function,
  onKeyDown: Function,
};

const TextInput = ({ value, focus, onChange, onFocus, onBlur, readonly, onKeyDown }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const intl = useIntl();
  const inputRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      if (inputRef && inputRef.current) {
        inputRef.current.select();
      }
    }, 200);
  });

  return (
    <>
      <InputWrapper focus={focus}>
        {({ ref }) => (
          <>
            <input
              ref={ref}
              readOnly
              spellCheck={false}
              value={value}
              onClick={() => {
                if (!readonly) {
                  onFocus();
                  setIsOpen(true);
                }
              }}
              onKeyDown={e => {
                if (!readonly && e.key === 'Enter') {
                  onFocus();
                  setIsOpen(true);
                }
                e.preventDefault();
                e.stopPropagation();
              }}
              placeholder={intl.formatMessage({
                id: 'components.sheet.textarea.placeholder',
                defaultMessage: 'Please enter a value',
              })}
              onFocus={onFocus}
            />
            <Dialog
              isOpen={isOpen}
              onRequestClose={() => {
                onChange(inputRef?.current?.value ?? '');
                onBlur();
                setIsOpen(false);
              }}
            >
              {isOpen && (
                <TextAreaInputDialog
                  inputRef={inputRef}
                  value={value || ''}
                  onKeyDown={onKeyDown}
                />
              )}
            </Dialog>
          </>
        )}
      </InputWrapper>
    </>
  );
};

export default TextInput;