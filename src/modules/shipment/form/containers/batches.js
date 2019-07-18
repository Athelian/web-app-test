// @flow
import type { BatchPayload, ContainerPayload, PartnerPayload } from 'generated/graphql';
import { Container } from 'unstated';
import update from 'immutability-helper';
import { isEquals, getByPath } from 'utils/fp';

type BatchFormState = {|
  batches: Array<BatchPayload>,
  hasCalledBatchesApiYet: boolean,
|};

const initValues: BatchFormState = {
  batches: [],
  hasCalledBatchesApiYet: false,
};

export default class ShipmentBatchesContainer extends Container<BatchFormState> {
  state = initValues;

  originalValues = initValues;

  existingBatches = initValues.batches;

  addExistingBatches = (batches: Array<BatchPayload>) => {
    this.existingBatches = [...this.existingBatches, ...batches];
  };

  removeExistingBatches = (batches: Array<BatchPayload>) => {
    this.existingBatches = [
      ...this.existingBatches.filter(existingBatch =>
        batches.some(batch => getByPath('id', batch) !== getByPath('id', existingBatch))
      ),
    ];
  };

  changeContainerIdToExistingBatches = (
    batches: Array<BatchPayload>,
    container: ContainerPayload
  ) => {
    this.existingBatches = [
      ...this.existingBatches.map(existingBatch =>
        batches.some(batch => getByPath('id', batch) === getByPath('id', existingBatch))
          ? update(existingBatch, { container: { $set: container } })
          : existingBatch
      ),
    ];
  };

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = this.state;
    this.existingBatches = this.state.batches;
    this.setState(this.originalValues);
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  setFieldArrayValue = (index: number, value: any) => {
    this.setState(prevState =>
      update(prevState, {
        batches: {
          [index]: {
            $merge: value,
          },
        },
      })
    );
  };

  initDetailValues = (batches: Array<BatchPayload>, hasCalledBatchesApiYet: boolean = false) => {
    this.setState({ batches, hasCalledBatchesApiYet });
    this.originalValues = { batches, hasCalledBatchesApiYet };
    this.existingBatches = batches;
  };

  changeMainExporter = (exporter: PartnerPayload) => {
    if (exporter) {
      this.setState(prevState => {
        return {
          batches: prevState.batches.filter(
            batch => getByPath('orderItem.order.exporter.id', batch) === getByPath('id', exporter)
          ),
        };
      });
    }
  };
}
