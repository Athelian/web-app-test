// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Layout from 'components/Layout';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { SectionHeader, SectionWrapper } from 'components/Form';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import MetadataForm from '../MetadataForm';
import { MetadataEditFormWrapperStyle, CustomFieldsSectionWrapperStyle } from './style';

type Props = {
  values: Array<Object>,
  onCancel: Function,
  onSave: Function,
  setFieldArrayValue: Function,
};

const MetadataEditFormWrapper = ({ values, onCancel, onSave, setFieldArrayValue }: Props) => (
  <Layout
    navBar={
      <SlideViewNavBar>
        <EntityIcon icon="METADATA" color="METADATA" />
        <JumpToSection>
          <SectionTabs
            link="metadataSection"
            label={
              <>
                <FormattedMessage
                  id="modules.metadata.sectionHeader"
                  defaultMessage="CUSTOM FIELDS"
                />
                ({values.length})
              </>
            }
            icon="METADATA"
          />
        </JumpToSection>
        <CancelButton onClick={onCancel} />
        <SaveButton onClick={onSave} />
      </SlideViewNavBar>
    }
  >
    <div className={MetadataEditFormWrapperStyle}>
      <SectionWrapper id="metadataSection">
        <SectionHeader
          icon="METADATA"
          title={
            <>
              <FormattedMessage id="module.metadata.sectionHeader" defaultMessage="CUSTOM FIELDS" />
              ({values.length})
            </>
          }
        />
        <div className={CustomFieldsSectionWrapperStyle}>
          <MetadataForm values={values} setFieldArrayValue={setFieldArrayValue} />
        </div>
      </SectionWrapper>
    </div>
  </Layout>
);

export default MetadataEditFormWrapper;
