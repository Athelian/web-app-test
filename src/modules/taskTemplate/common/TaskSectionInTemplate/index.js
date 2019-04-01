// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import { injectUid } from 'utils/id';
import { SectionNavBar } from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import { SectionWrapper, SectionHeader } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import {
  TASK_CREATE,
  TASK_UPDATE,
  TASK_DELETE,
  TASK_TEMPLATE_CREATE,
  TASK_TEMPLATE_UPDATE,
} from 'modules/permission/constants/task';
import { FormContainer } from 'modules/form';
import TaskTemplateFormContainer from 'modules/taskTemplate/form/container';
import { TasksSectionWrapperStyle, TasksSectionBodyStyle, ItemGridStyle } from './style';
import Tasks from './components/Tasks';

function TaskSectionInTemplate() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const allowCreateOrUpdate = hasPermission([TASK_TEMPLATE_CREATE, TASK_TEMPLATE_UPDATE]);

  return (
    <Subscribe to={[TaskTemplateFormContainer, FormContainer]}>
      {({ state: { entityType, tasks }, setFieldValue }, { setFieldTouched }) => (
        <SectionWrapper id="task_template_tasks_section">
          <SectionHeader
            icon="TASK"
            title={
              <>
                <FormattedMessage id="modules.Tasks.task" defaultMessage="TASK" />
                {' ('}
                <FormattedNumber value={tasks.length} />
                {')'}
              </>
            }
          />
          <div className={TasksSectionWrapperStyle}>
            <SectionNavBar>
              {allowCreateOrUpdate && hasPermission(TASK_CREATE) && (
                <NewButton
                  label={
                    <FormattedMessage id="modules.taskTemplate.newTask" defaultMessage="NEW TASK" />
                  }
                  onClick={() => {
                    setFieldValue('tasks', [
                      ...tasks,
                      injectUid({
                        isNew: true,
                        name: `task - ${tasks.length + 1}`,
                        assignedTo: [],
                        tags: [],
                      }),
                    ]);
                    setFieldTouched('tasks');
                  }}
                />
              )}
            </SectionNavBar>
            <div className={TasksSectionBodyStyle}>
              <div className={ItemGridStyle}>
                <Tasks
                  isInTemplate
                  editable={allowCreateOrUpdate && hasPermission([TASK_CREATE, TASK_UPDATE])}
                  removable={allowCreateOrUpdate && hasPermission(TASK_DELETE)}
                  viewForm={allowCreateOrUpdate && hasPermission(TASK_UPDATE)}
                  type={entityType}
                  tasks={tasks}
                  onSwap={(index: number, direction: 'left' | 'right') => {
                    const nextIndex = direction === 'left' ? index - 1 : index + 1;

                    if (nextIndex > -1 && nextIndex < tasks.length) {
                      const clonedTasks = [...tasks];
                      clonedTasks[nextIndex] = { ...tasks[index] };
                      clonedTasks[index] = { ...tasks[nextIndex] };
                      setFieldValue('tasks', clonedTasks);
                      setFieldTouched(`tasks.${index}`);
                      setFieldTouched(`tasks.${nextIndex}`);
                    }
                  }}
                  onRemove={({ id }) => {
                    setFieldValue('tasks', tasks.filter(({ id: itemId }) => id !== itemId));
                    setFieldTouched(`tasks.${id}`);
                  }}
                  onSave={(index, newValue) => {
                    setFieldValue(`tasks.${index}`, newValue);
                    setFieldTouched(`tasks.${index}`);
                  }}
                />
              </div>
            </div>
          </div>
        </SectionWrapper>
      )}
    </Subscribe>
  );
}

export default TaskSectionInTemplate;
