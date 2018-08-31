// @flow
import {
  type PureSelectInputProps,
  defaultPureSelectInputProps,
} from 'components/Form/PureInputs/PureSelectInput/type';
import { defaultStyledInputProps } from 'components/Form/StyledInputs/type';
import type { StyledSearchSelectInputProps } from '../StyledSelectInput/StyledSearchSelectInput/type';

type OptionalProps = PureSelectInputProps;

export type EnumInputProps = StyledSearchSelectInputProps & {
  pureInputOptions: OptionalProps,
  enumType: string,
};

export const defaultStyledEnumInputProps = {
  ...defaultStyledInputProps,
  pureInputOptions: defaultPureSelectInputProps,
};

export default defaultStyledEnumInputProps;
