// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { getByPath, isEquals, getByPathWithDefault } from 'utils/fp';
import scrollIntoView from 'utils/scrollIntoView';
import AutoDateBinding from 'modules/task/common/AutoDateBinding';
import FormattedNumber from 'components/FormattedNumber';
import { SectionWrapper, SectionHeader } from 'components/Form';
import {
  ShipmentBatchesContainer,
  ShipmentTasksContainer,
  ShipmentInfoContainer,
  ShipmentTimelineContainer,
} from './containers';
import {
  ShipmentSection,
  CargoSection,
  DocumentsSection,
  OrdersSection,
  TimelineSection,
  ShipmentTasksSection,
} from './components';
import { ShipmentFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  loading: boolean,
  isClone: boolean,
  anchor: string,
  initDataForSlideView: Object,
};

type Props = OptionalProps & {
  shipment: Object,
};

const defaultProps = {
  isNew: false,
  isClone: false,
  anchor: '',
  initDataForSlideView: {},
};

class ShipmentForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { anchor } = this.props;

    if (anchor) {
      // wait for the element is rendering on DOM
      const targetId = 'timelineInfoSection';
      const retryFindElement = () => {
        const foundElement = document.querySelector(`#${targetId}`);
        if (!foundElement) {
          requestAnimationFrame(retryFindElement);
        } else {
          // scroll to element after rendering
          setTimeout(() => scrollIntoView({ targetId: anchor }), 200);
        }
      };
      requestAnimationFrame(retryFindElement);
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    const { shipment } = this.props;

    return !isEquals(shipment, nextProps.shipment);
  }

  render() {
    const { isNew, isClone, shipment, loading, initDataForSlideView } = this.props;
    return (
      <div className={ShipmentFormWrapperStyle}>
        <SectionWrapper id="shipment_shipmentSection">
          <ShipmentSection
            shipment={shipment}
            isLoading={loading}
            isNew={isNew}
            isClone={isClone}
            initDataForSlideView={initDataForSlideView}
          />
        </SectionWrapper>

        <SectionWrapper id="shipment_timelineSection">
          <SectionHeader
            icon="TIMELINE"
            title={<FormattedMessage id="modules.Shipments.timeline" defaultMessage="TIMELINE" />}
          />
          <Subscribe to={[ShipmentTasksContainer]}>
            {({ state: { hasCalledTasksApiYet } }) => (
              <TimelineSection
                isTaskReadyForBinding={hasCalledTasksApiYet}
                isNew={isNew}
                entityId={!isClone && shipment.id ? shipment.id : ''}
                isLoading={loading}
              />
            )}
          </Subscribe>
        </SectionWrapper>

        <SectionWrapper id="shipment_cargoSection">
          <Subscribe to={[ShipmentBatchesContainer]}>
            {({ state: { batches } }) => (
              <SectionHeader
                icon="CARGO"
                title={
                  <>
                    <FormattedMessage id="modules.Shipments.cargo" defaultMessage="CARGO " />
                    {' ('}
                    <FormattedNumber value={batches.length} />
                    {')'}
                  </>
                }
              />
            )}
          </Subscribe>
          <Subscribe to={[ShipmentInfoContainer]}>
            {({ state: shipmentInfo }) => (
              <CargoSection
                exporterId={getByPath('exporter.id', shipmentInfo)}
                importerId={getByPathWithDefault('', 'importer.id', shipmentInfo)}
                shipmentIsArchived={shipment.archived}
              />
            )}
          </Subscribe>
        </SectionWrapper>

        <SectionWrapper id="shipment_documentsSection">
          <DocumentsSection
            entityId={!isClone && shipment.id ? shipment.id : ''}
            isLoading={loading}
          />
        </SectionWrapper>
        <SectionWrapper id="shipment_taskSection">
          <Subscribe to={[ShipmentTasksContainer, ShipmentInfoContainer]}>
            {({ initDetailValues }, { state: { importer, exporter } }) => (
              <ShipmentTasksSection
                groupIds={[getByPath('id', importer), getByPath('id', exporter)].filter(Boolean)}
                initValues={initDetailValues}
                isLoading={loading}
                entityId={!isClone && shipment.id ? shipment.id : ''}
              />
            )}
          </Subscribe>
        </SectionWrapper>

        <SectionWrapper id="shipment_orderSection">
          <OrdersSection
            entityId={!isClone && shipment.id ? shipment.id : ''}
            isLoading={loading}
          />
        </SectionWrapper>
        <Subscribe to={[ShipmentTasksContainer, ShipmentInfoContainer, ShipmentTimelineContainer]}>
          {(
            {
              state: {
                todo: { tasks },
              },
              setFieldValue,
            },
            { state: info },
            { state: timeline }
          ) => (
            <AutoDateBinding
              type="Shipment"
              values={{ ...info, ...timeline }}
              tasks={tasks}
              setTaskValue={setFieldValue}
            />
          )}
        </Subscribe>
      </div>
    );
  }
}

export default ShipmentForm;
