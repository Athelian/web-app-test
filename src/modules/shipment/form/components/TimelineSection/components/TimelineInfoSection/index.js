// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import GridColumn from 'components/GridColumn';
import Icon from 'components/Icon';
import NewButton from 'components/NavButtons/NewButton';
import { injectUid } from 'utils/id';
import { UserConsumer } from 'modules/user';
import UserAvatar from 'components/UserAvatar';
import FormattedName from 'components/FormattedName';
import FormattedDate from 'components/FormattedDate';
import { CustomButton } from 'components/NavButtons';
import { FormField } from 'modules/form';
import { dateInputFactory } from 'modules/form/helpers';
import { SectionHeader, Label, DefaultAdjustmentStyle, FieldItem } from 'components/Form';
import AssignUsers from '../AssignUsers';
import {
  TimelineInfoSectionWrapperStyle,
  AssignedAndApprovalWrapperStyle,
  AssignmentWrapperStyle,
  AssignmentStyle,
  RemoveAssignmentButtonStyle,
  AddAssignmentButtonStyle,
  ApprovalWrapperStyle,
  ApprovedByWrapperStyle,
  ApprovedByStyle,
  ApprovedAtStyle,
  UnapproveButtonStyle,
  AddDateButtonWrapperStyle,
} from './style';

type OptionalProps = {
  timelineDate: {
    assignedTo: Array<{
      id: string,
      firstName: string,
      lastName: string,
    }>,
    approvedAt: ?Date,
    approvedBy: ?{
      firstName: string,
      lastName: string,
    },
    timelineDateRevisions: Array<Object>,
    date: Date,
  },
};

type Props = OptionalProps & {
  isNew: boolean,
  icon: string,
  title: string,
  sourceName: string,
  setFieldDeepValue: (field: string, value: any) => void,
  removeArrayItem: Function,
};

const defaultProps = {
  timelineDate: { assignedTo: [], timelineDateRevisions: [] },
};

class TimelineInfoSection extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  handleRemoveAssignedTo = (index: number) => {
    const { sourceName, removeArrayItem } = this.props;

    removeArrayItem(`${sourceName}.assignedTo[${index}]`);
  };

  handleUnapprove = () => {
    const { timelineDate, sourceName, setFieldDeepValue } = this.props;

    const newState = { ...timelineDate, approvedAt: null, approvedBy: null };

    setFieldDeepValue(sourceName, newState);
  };

  handleApprove = (user: Object) => {
    const { timelineDate, sourceName, setFieldDeepValue } = this.props;

    const newState = { ...timelineDate, approvedAt: new Date(), approvedBy: user };

    setFieldDeepValue(sourceName, newState);
  };

  render() {
    const {
      isNew,
      icon,
      title,
      timelineDate,
      sourceName,
      setFieldDeepValue,
      removeArrayItem,
      ...rest
    } = this.props;
    return (
      <div className={TimelineInfoSectionWrapperStyle} {...rest}>
        <GridColumn gap="10px">
          <SectionHeader icon={icon} title={title} />
          <div className={AssignedAndApprovalWrapperStyle}>
            <GridColumn gap="5px">
              <Label>ASSIGNED TO</Label>
              <div className={AssignmentWrapperStyle}>
                {timelineDate &&
                  timelineDate.assignedTo &&
                  timelineDate.assignedTo.map(({ id, firstName, lastName }, index) => (
                    <div className={AssignmentStyle} key={id}>
                      <button
                        className={RemoveAssignmentButtonStyle}
                        onClick={() => this.handleRemoveAssignedTo(index)}
                        type="button"
                      >
                        <Icon icon="REMOVE" />
                      </button>
                      <UserAvatar firstName={firstName} lastName={lastName} />
                    </div>
                  ))}
                {timelineDate &&
                  timelineDate.assignedTo &&
                  timelineDate.assignedTo.length < 5 && (
                    <BooleanValue>
                      {({ value: isOpen, toggle }) => (
                        <>
                          <button
                            className={AddAssignmentButtonStyle}
                            type="button"
                            onClick={toggle}
                          >
                            <Icon icon="ADD" />
                          </button>
                          <SlideView
                            isOpen={isOpen}
                            onRequestClose={toggle}
                            options={{ width: '1030px' }}
                          >
                            {isOpen && <AssignUsers onSelect={console.warn} onCancel={toggle} />}
                          </SlideView>
                        </>
                      )}
                    </BooleanValue>
                  )}
              </div>
            </GridColumn>

            <GridColumn gap="5px">
              <Label align="right">APPROVAL</Label>
              <div className={ApprovalWrapperStyle}>
                {timelineDate && timelineDate.approvedAt && timelineDate.approvedBy ? (
                  <>
                    <div className={ApprovedByWrapperStyle}>
                      <div className={ApprovedByStyle}>
                        <FormattedName
                          firstName={timelineDate.approvedBy.firstName}
                          lastName={timelineDate.approvedBy.lastName}
                        />
                      </div>
                      <div className={ApprovedAtStyle}>
                        <FormattedDate value={timelineDate.approvedAt} />
                      </div>
                    </div>
                    <UserAvatar
                      firstName={timelineDate.approvedBy.firstName}
                      lastName={timelineDate.approvedBy.lastName}
                    />
                    <button
                      className={UnapproveButtonStyle}
                      onClick={this.handleUnapprove}
                      type="button"
                    >
                      <Icon icon="CLEAR" />
                    </button>
                  </>
                ) : (
                  <UserConsumer>
                    {({ user }) => (
                      <CustomButton
                        onClick={() => this.handleApprove(user)}
                        label="APPROVE"
                        icon={<Icon icon="CHECKED" />}
                        color="blue"
                      />
                    )}
                  </UserConsumer>
                )}
              </div>
            </GridColumn>
          </div>

          <GridColumn gap="10px">
            {/* <Label>DATES</Label> */}
            <div className={AddDateButtonWrapperStyle}>
              <NewButton
                title="NEW DATE"
                onClick={() => {
                  setFieldDeepValue(
                    `${sourceName}.timelineDateRevisions[${(timelineDate &&
                      timelineDate.timelineDateRevisions &&
                      timelineDate.timelineDateRevisions.length) ||
                      0}]`,
                    injectUid({
                      isNew: true,
                      type: 'Other',
                      date: '',
                      memo: '',
                      updatedAt: new Date(),
                    })
                  );
                }}
              />
            </div>
            {timelineDate &&
              timelineDate.timelineDateRevisions &&
              timelineDate.timelineDateRevisions.reverse().map(
                (adjustment, index) =>
                  adjustment && (
                    <DefaultAdjustmentStyle
                      isNew={isNew}
                      index={index}
                      adjustment={adjustment}
                      key={adjustment.id}
                      setFieldArrayValue={setFieldDeepValue}
                      removeArrayItem={removeArrayItem}
                      values={timelineDate}
                      enumType="TimelineDateRevisionType"
                      targetName={`${sourceName}.timelineDateRevisions`}
                      typeName="type"
                      memoName="memo"
                      valueInput={
                        <FormField
                          name={`${sourceName}.timelineDateRevisions.${index}.date`}
                          initValue={adjustment.date}
                          setFieldValue={setFieldDeepValue}
                        >
                          {({ name, ...inputHandlers }) =>
                            dateInputFactory({
                              name,
                              inputHandlers,
                              isNew,
                              initValue: adjustment.date,
                            })
                          }
                        </FormField>
                      }
                    />
                  )
              )}
            <FieldItem
              label={<Label>INITIAL DATE</Label>}
              input={
                <FormField
                  name={`${sourceName}.date`}
                  initValue={timelineDate && timelineDate.date}
                  setFieldValue={setFieldDeepValue}
                >
                  {({ name, ...inputHandlers }) =>
                    dateInputFactory({
                      name,
                      inputHandlers,
                      isNew,
                      initValue: timelineDate && timelineDate.date,
                    })
                  }
                </FormField>
              }
            />
          </GridColumn>
        </GridColumn>
      </div>
    );
  }
}

export default TimelineInfoSection;
