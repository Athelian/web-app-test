// @flow
// $FlowFixMe: it is open issue on flow https://github.com/facebook/flow/issues/7093
import { useState, useCallback } from 'react';
import type { ValidationObject } from './type.js.flow';

function useInChargeInput(initialValues: Array<Object>, schema: ValidationObject) {
  const [values, setValues] = useState(initialValues || []);
  const onChange = useCallback(
    (
      newValues: Array<{
        id: string,
        firstName: string,
        lastName: string,
      }>
    ) => {
      setValues(newValues || []);
    },
    []
  );

  return {
    values,
    onChange,
    isRemain: values.length < (schema.max || 0),
  };
}

export default useInChargeInput;
