// @flow
import * as React from 'react';
import SlideView from 'components/SlideView';
import OrderForm from 'modules/order/index.form';
import ItemForm from 'modules/orderItem/index.form';
import BatchForm from 'modules/batch/index.form';
import ContainerForm from 'modules/container/index.form';
import ShipmentForm from 'modules/shipment/index.form';
import { ORDER, ORDER_ITEM, BATCH, SHIPMENT, CONTAINER } from 'modules/relationMapV2/constants';
import { Entities } from 'modules/relationMapV2/store';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { encodeId } from 'utils/id';
import emitter from 'utils/emitter';

type Props = {|
  type: typeof ORDER | typeof ORDER_ITEM | typeof BATCH | typeof SHIPMENT | typeof CONTAINER,
  selectedId: string,
  onClose: () => void,
|};

const EditFormSlideView = ({ type, selectedId: id, onClose }: Props) => {
  const isReady = React.useRef(true);
  const { dispatch } = React.useContext(RelationMapContext);
  const { mapping, checkRemoveEntities } = Entities.useContainer();
  const onRequestClose = React.useCallback(() => {
    if (isReady.current) {
      onClose();
    }
  }, [onClose]);

  const orders = mapping?.entities?.orders ?? {};
  const orderItems = mapping?.entities?.orderItems ?? {};
  React.useEffect(() => {
    const listener = emitter.addListener('MUTATION', (result: Object) => {
      isReady.current = !!result;
      const entity = result?.data?.orderItemUpdate || result?.data?.orderUpdate;
      if (entity) {
        dispatch({
          type: 'RECHECK_TARGET',
          payload: {
            ...result.data,
            mapping: {
              orderItems,
              orders,
            },
          },
        });
        checkRemoveEntities(entity);
      }
    });
    return () => {
      listener.remove();
    };
  }, [checkRemoveEntities, dispatch, orderItems, orders]);

  let form = null;
  switch (type) {
    case ORDER: {
      form = <OrderForm orderId={encodeId(id)} isSlideView />;
      break;
    }
    case ORDER_ITEM: {
      form = <ItemForm orderItemId={encodeId(id)} isSlideView />;
      break;
    }
    case BATCH: {
      form = <BatchForm batchId={encodeId(id)} isSlideView />;
      break;
    }
    case CONTAINER: {
      form = <ContainerForm containerId={encodeId(id)} isSlideView />;
      break;
    }
    case SHIPMENT: {
      form = <ShipmentForm shipmentId={encodeId(id)} isSlideView />;
      break;
    }
    default: {
      form = null;
      break;
    }
  }
  return (
    <SlideView isOpen={id !== ''} onRequestClose={onRequestClose}>
      {form}
    </SlideView>
  );
};

export default EditFormSlideView;