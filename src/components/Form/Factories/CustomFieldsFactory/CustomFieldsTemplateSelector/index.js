// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { ObjectValue } from 'react-values';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import { removeTypename } from 'utils/data';
import loadMore from 'utils/loadMore';
import MaskGridView from 'modules/metadata/components/MaskGridView';
import { TemplateCard } from 'components/Cards';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { masksQuery } from 'modules/metadata/query';
import { countMaskFieldDefinitions } from 'utils/customFields';

type OptionalProps = {
  saveButtonId: string,
  selected: ?{
    id: string,
    name: string,
  },
};

type Props = OptionalProps & {
  entityType: string,
  onCancel: Function,
  onSave: Function,
};

const defaultProps = {
  selected: {
    id: '',
    name: '',
  },
};

const CustomFieldsTemplateSelector = ({
  entityType,
  selected,
  onCancel,
  onSave,
  saveButtonId,
}: Props) => (
  <Query
    query={masksQuery}
    variables={{
      page: 1,
      perPage: 10,
      filterBy: { entityTypes: [entityType] },
    }}
    fetchPolicy="network-only"
  >
    {({ loading, data, fetchMore, error }) => {
      if (error) {
        return error.message;
      }

      const nextPage = getByPathWithDefault(1, 'masks.page', data) + 1;
      const totalPage = getByPathWithDefault(1, 'masks.totalPage', data);
      const hasMore = nextPage <= totalPage;

      return (
        <ObjectValue defaultValue={selected}>
          {({ value, set }) => (
            <SlideViewLayout>
              <SlideViewNavBar>
                <EntityIcon icon="TEMPLATE" color="TEMPLATE" invert />
                <CancelButton onClick={onCancel} />
                <SaveButton
                  id={saveButtonId}
                  data-testid="saveButtonOnSelectMask"
                  disabled={isEquals(value, selected)}
                  onClick={() => onSave(value)}
                />
              </SlideViewNavBar>

              <Content>
                <MaskGridView
                  entityType={entityType}
                  items={getByPathWithDefault([], 'masks.nodes', data)}
                  onLoadMore={() =>
                    loadMore({ fetchMore, data }, { filter: { entityTypes: entityType } }, 'masks')
                  }
                  hasMore={hasMore}
                  isLoading={loading}
                  renderItem={mask => (
                    <TemplateCard
                      key={mask.id}
                      template={{
                        id: mask.id,
                        title: mask.name,
                        description: mask.memo,
                        count: countMaskFieldDefinitions(mask),
                      }}
                      type="METADATA"
                      onSelect={() => {
                        if (value && mask.id === value.id) {
                          set(null);
                        } else {
                          set(removeTypename(mask));
                        }
                      }}
                      selectable
                      selected={value && mask.id === value.id}
                    />
                  )}
                />
              </Content>
            </SlideViewLayout>
          )}
        </ObjectValue>
      );
    }}
  </Query>
);

CustomFieldsTemplateSelector.defaultProps = defaultProps;

export default CustomFieldsTemplateSelector;
