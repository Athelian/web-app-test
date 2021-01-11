// @flow
import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FormattedMessage } from 'react-intl';
import { Label, TagsInput } from 'components/Form';
import { useViewerHasPermissions } from 'contexts/Permissions';
import { TAG_LIST } from 'modules/permission/constants/tag';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import { tagsByIDsQuery } from './query';

type ImplProps = {
  ...FilterInputProps<Array<string>>,
  tagType: string,
};

const TagsImpl = ({ value, readonly, onChange, tagType }: ImplProps) => {
  const hasPermissions = useViewerHasPermissions();
  const { data } = useQuery(tagsByIDsQuery, {
    variables: { ids: value },
    fetchPolicy: 'cache-and-network',
  });

  return (
    <>
      <Label height="30px">
        <FormattedMessage {...messages.tags} />
      </Label>

      <TagsInput
        name="tags"
        width="200px"
        tagType={tagType}
        disabled={readonly}
        values={data?.tagsByIDs ?? []}
        onChange={newTags => {
          onChange(newTags.map(t => t.id));
        }}
        onClickRemove={removedTag => {
          onChange(value.filter(id => id !== removedTag.id));
        }}
        editable={{
          set: hasPermissions(TAG_LIST),
          remove: true,
        }}
      />
    </>
  );
};

const Tags = (tagType: string) => ({
  value,
  onChange,
  readonly,
}: FilterInputProps<Array<string>>) => (
  <TagsImpl value={value} readonly={readonly} onChange={onChange} tagType={tagType} />
);

export const ProductTags = Tags('Product');
export const OrderTags = Tags('Order');
export const OrderItemTags = Tags('OrderItem');
export const BatchTags = Tags('Batch');
export const ShipmentTags = Tags('Shipment');
export const ContainerTags = Tags('Container');
export const UserTags = Tags('User');
export const TaskTags = Tags('Task');
export const ProjectTags = Tags('Project');
export const FileTags = Tags('File');

export default Tags;