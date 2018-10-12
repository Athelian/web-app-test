// @flow
import * as React from 'react';
import Downshift from 'downshift';
import randomcolor from 'randomcolor';
import { colors } from 'styles/common';
import {
  WrapperStyle,
  ColorPreviewStyle,
  DropdownWrapper,
  RandomizeButtonStyle,
  ColorPresetsWrapperStyle,
  PresetStyle,
} from 'components/Form/ColorInput/style';
import Icon from 'components/Icon';

type Props = {
  name: string,
  value: string,
  disabled?: boolean,
  readOnly?: boolean,
  error?: boolean,
  onChange?: Object => void,
  onBlur?: (event: any) => void,
};

const defaultProps = {
  disabled: false,
  readOnly: false,
  error: false,
  onChange: () => {},
  onBlur: () => {},
};

const COLOR_PRESETS = [
  colors.TEAL,
  colors.BLUE,
  colors.GRAY_DARK,
  colors.RED,
  colors.ORANGE,
  colors.YELLOW,
  colors.PURPLE,
];

class ColorInput extends React.Component<Props> {
  static defaultProps = defaultProps;

  handleStateChange = ({ isOpen }: Object) => {
    if (isOpen === false) {
      this.handleBlur();
    }
  };

  handleChange = (color: string) => {
    const { name, onChange } = this.props;
    if (onChange) {
      const evt = { target: { name, value: color } };
      onChange(evt);
    }
  };

  handleBlur = () => {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const { value, disabled, readOnly } = this.props;

    return (
      <Downshift onStateChange={this.handleStateChange}>
        {({ isOpen, getToggleButtonProps }) => (
          <div className={WrapperStyle}>
            <button
              type="button"
              className={ColorPreviewStyle(value, disabled || false, readOnly || false)}
              {...getToggleButtonProps()}
            >
              <Icon icon="COLOR" />
            </button>
            {isOpen && (
              <div className={DropdownWrapper}>
                <div className={ColorPresetsWrapperStyle}>
                  <button
                    type="button"
                    onClick={() => {
                      this.handleChange(randomcolor());
                    }}
                    className={RandomizeButtonStyle}
                  >
                    <Icon icon="SYNC" />
                  </button>
                  {COLOR_PRESETS.map(color => (
                    <button
                      type="button"
                      key={color}
                      className={PresetStyle(color)}
                      onClick={() => {
                        this.handleChange(color);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Downshift>
    );
  }
}

export default ColorInput;
