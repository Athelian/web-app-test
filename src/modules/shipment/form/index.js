// @flow
import React, { lazy, Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import LoadingIcon from 'components/LoadingIcon';
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
import { ShipmentSection } from './components';
import { ShipmentFormWrapperStyle } from './style';

const AsyncCargoSection = lazy(() => import('./components/CargoSection'));
const AsyncDocumentsSection = lazy(() => import('./components/DocumentsSection'));
const AsyncOrdersSection = lazy(() => import('./components/OrdersSection'));
const AsyncTimelineSection = lazy(() => import('./components/TimelineSection'));
const AsyncShipmentTasksSection = lazy(() => import('./components/ShipmentTasksSection'));

type OptionalProps = {
  isNew: boolean,
  loading: boolean,
  isOwner: boolean,
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
  isOwner: true,
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
    const { isNew, isClone, shipment, loading } = this.props;
    return (
      <Suspense fallback={<LoadingIcon />}>
        <div className={ShipmentFormWrapperStyle}>
          <ShipmentSection {...this.props} />

          <SectionWrapper id="shipment_timelineSection">
            <SectionHeader
              icon="TIMELINE"
              title={<FormattedMessage id="modules.Shipments.timeline" defaultMessage="TIMELINE" />}
            />
            <AsyncTimelineSection isNew={isNew} />
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
                <AsyncCargoSection
                  exporterId={getByPath('exporter.id', shipmentInfo)}
                  importerId={getByPathWithDefault('', 'importer.id', shipmentInfo)}
                  shipmentIsArchived={shipment.archived}
                />
              )}
            </Subscribe>
          </SectionWrapper>

          <SectionWrapper id="shipment_documentsSection">
            <AsyncDocumentsSection
              entityId={!isClone && shipment.id ? shipment.id : ''}
              isLoading={loading}
            />
          </SectionWrapper>
          <SectionWrapper id="shipment_taskSection">
            <Subscribe to={[ShipmentTasksContainer, ShipmentInfoContainer]}>
              {({ initDetailValues }, { state: { importer, exporter } }) => (
                <AsyncShipmentTasksSection
                  groupIds={[getByPath('id', importer), getByPath('id', exporter)].filter(Boolean)}
                  initValues={initDetailValues}
                  isLoading={loading}
                  entityId={!isClone && shipment.id ? shipment.id : ''}
                />
              )}
            </Subscribe>
          </SectionWrapper>

          <SectionWrapper id="shipment_orderSection">
            <AsyncOrdersSection entityId={shipment.id} isLoading={loading} />
          </SectionWrapper>
          <Subscribe
            to={[ShipmentTasksContainer, ShipmentInfoContainer, ShipmentTimelineContainer]}
          >
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
      </Suspense>
    );
  }
}

export default ShipmentForm;
