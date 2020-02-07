// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import type { FilePayload } from 'generated/graphql';
import BaseCard from 'components/Cards';
import FormattedNumber from 'components/FormattedNumber';
import Icon from 'components/Icon';
import GridRow from 'components/GridRow';
import { Label } from 'components/Form';
import { BaseButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import DocumentFormSlideView from 'modules/document/index.formSlideView';
import DocumentsSelector from './DocumentsSelector';
import {
  DocumentTypeAreaWrapperStyle,
  DocumentTypeAreaHeaderStyle,
  AddDocumentButtonWrapperStyle,
  AddDocumentButtonLabelStyle,
  AddDocumentButtonIconStyle,
  DocumentTypeAreaBodyStyle,
  DummyDocumentCard,
} from './style';

type Props = {|
  entityType: string,
  type: { value: string, label: React$Node },
  files: Array<FilePayload>,
  onSave: Function,
  onUpload: Function,
  canUpload: boolean,
  canAddOrphan: boolean,
  canViewForm: boolean,
|};

const DocumentTypeArea = ({
  entityType,
  type,
  files,
  onSave,
  onUpload,
  canUpload,
  canAddOrphan,
  canViewForm,
}: Props) => {
  return (
    <div className={DocumentTypeAreaWrapperStyle}>
      <div className={DocumentTypeAreaHeaderStyle}>
        <Label>
          {type.label}
          {' ('}
          <FormattedNumber value={files.length} />)
        </Label>

        <GridRow gap="5px">
          {canAddOrphan && (
            <BooleanValue>
              {({ value: documentsSelectorIsOpen, set: setDocumentsSelectorIsOpen }) => (
                <>
                  <BaseButton
                    label={
                      <FormattedMessage
                        id="modules.Documents.selectDocument"
                        defaultMessage="Select Documents"
                      />
                    }
                    icon="ADD"
                    onClick={() => setDocumentsSelectorIsOpen(true)}
                    textColor="WHITE"
                    hoverTextColor="WHITE"
                    backgroundColor="GRAY_LIGHT"
                    hoverBackgroundColor="GRAY"
                  />

                  <SlideView
                    isOpen={documentsSelectorIsOpen}
                    onRequestClose={() => setDocumentsSelectorIsOpen(false)}
                    shouldConfirm={() => {
                      const button = document.getElementById('saveButtonOnSelectDocuments');
                      return button;
                    }}
                  >
                    <DocumentsSelector
                      onCancel={() => setDocumentsSelectorIsOpen(false)}
                      onSelect={selectedFiles => {
                        onSave([
                          ...files,
                          ...selectedFiles.map(file => ({
                            ...file,
                            entity: { __typename: entityType },
                          })),
                        ]);
                        setDocumentsSelectorIsOpen(false);
                      }}
                      alreadyAddedDocuments={files}
                    />
                  </SlideView>
                </>
              )}
            </BooleanValue>
          )}

          {canUpload && (
            <label className={AddDocumentButtonWrapperStyle}>
              <div className={AddDocumentButtonLabelStyle}>
                <FormattedMessage
                  id="documents.button.uploadDocuments"
                  defaultMessage="Upload Documents"
                />
              </div>
              <div className={AddDocumentButtonIconStyle}>
                <Icon icon="UPLOAD" />
              </div>
              <input type="file" accept="*" hidden multiple value="" onChange={onUpload} />
            </label>
          )}
        </GridRow>
      </div>

      {files.length > 0 && (
        <div className={DocumentTypeAreaBodyStyle}>
          {files.map(file => (
            <BooleanValue>
              {({ value: documentFormIsOpen, set: setDocumentFormIsOpen }) => (
                <>
                  <BaseCard
                    key={file.id}
                    icon="DOCUMENT"
                    color="DOCUMENT"
                    onClick={evt => {
                      evt.stopPropagation();
                      if (canViewForm) {
                        setDocumentFormIsOpen(true);
                      }
                    }}
                  >
                    <div className={DummyDocumentCard}>{file.id}</div>
                  </BaseCard>

                  <SlideView
                    isOpen={documentFormIsOpen}
                    onRequestClose={() => setDocumentFormIsOpen(false)}
                    shouldConfirm={() => {
                      const button = document.getElementById('document_form_save_button');
                      return button;
                    }}
                  >
                    <DocumentFormSlideView
                      isNew={file.isNew}
                      file={file}
                      onSave={updatedFile => {
                        onSave(files.map(f => (f.id === updatedFile.id ? updatedFile : f)));
                        setDocumentFormIsOpen(false);
                      }}
                    />
                  </SlideView>
                </>
              )}
            </BooleanValue>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentTypeArea;
