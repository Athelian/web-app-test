// @flow
import * as React from 'react';
import FormattedDate from 'components/FormattedDate';
import UserAvatar from 'components/UserAvatar';
import DisplayWrapper from '../DisplayWrapper';
import { DateStyle } from './style';

type Props = {
  value: {
    at: Date,
    by: {
      firstName: string,
      lastName: string,
      avatar: {
        path: string,
      } | null,
    },
  },
};

const DateUser = ({ value }: Props) => {
  return (
    <DisplayWrapper>
      <span className={DateStyle}>
        <FormattedDate value={value.at} />
      </span>
      <UserAvatar
        width="20px"
        height="20px"
        firstName={value.by.firstName}
        lastName={value.by.lastName}
        image={value.by.avatar?.path}
      />
    </DisplayWrapper>
  );
};

export default DateUser;