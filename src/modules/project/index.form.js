// @flow
import * as React from 'react';
import { omit } from 'lodash';
import { Provider, Subscribe } from 'unstated';
import { injectIntl, type IntlShape } from 'react-intl';
import { Mutation } from 'react-apollo';
import apolloClient from 'apollo';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import { showToastError } from 'utils/errors';
import type { ProjectPayload, FilePayload, Project, Tag, Milestone } from 'generated/graphql';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import logger from 'utils/logger';
import { getByPath } from 'utils/fp';
import { FormContainer } from 'modules/form';
import Timeline from 'modules/timeline/components/Timeline';
import { deleteManyFileMutation } from 'modules/document/mutation';
import QueryForm from 'components/common/QueryForm';
import { CancelButton, ExportButton } from 'components/Buttons';
import { UserConsumer } from 'contexts/Viewer';
import ResetFormButton from 'components/ResetFormButton';
import SaveFormButton from 'components/SaveFormButton';
import { NavBar, EntityIcon, LogsButton } from 'components/NavBar';
import SlideView from 'components/SlideView';
import { decodeId, encodeId, uuid } from 'utils/id';
import { removeTypename } from 'utils/data';
import { projectExportQuery, projectTimelineQuery } from './query';
import ProjectForm from './form';
import validator from './form/validator';
import {
  ProjectInfoContainer,
  ProjectTagsContainer,
  ProjectMilestonesContainer,
} from './form/containers';
import { projectFormQuery } from './form/query';
import {
  createProjectMutation,
  updateProjectMutation,
  prepareParsedProjectInput,
  deleteTaskMutation,
} from './form/mutation';

type OptionalProps = {
  path: string,
  projectId: string,
  isSlideView: boolean,
  redirectAfterSuccess: boolean,
  onSuccessCallback: ?Function,
  onCancel?: Function,
  initDataForSlideView: Object,
};

type Props = OptionalProps & {
  intl: IntlShape,
};

const defaultProps = {
  path: '',
  projectId: '',
  isSlideView: false,
  onSuccessCallback: null,
  redirectAfterSuccess: true,
  initDataForSlideView: {},
};

const formContainer = new FormContainer();
class ProjectFormModule extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  componentWillUnmount() {
    formContainer.onReset();
  }

  isNew = () => {
    const { path } = this.props;
    return path.startsWith('new');
  };

  onCancel = () => navigate('/project');

  onDeleteTask = async (taskIds: Array<string>) => {
    await Promise.all(
      taskIds.map(id =>
        apolloClient.mutate({
          mutation: deleteTaskMutation,
          variables: {
            id,
          },
        })
      )
    ).then(logger.warn);
  };

  onSave = async (
    originalValues: Object,
    formData: Object,
    saveProject: Function,
    needDeletedFiles: Array<FilePayload>,
    deleteFiles: Function,
    onSuccess: Object => void,
    onErrors: Function = () => {}
  ) => {
    const { projectId, intl, onSuccessCallback } = this.props;
    const isNew = this.isNew();

    const input = prepareParsedProjectInput(
      isNew ? { originalTasks: originalValues.originalTasks } : removeTypename(originalValues),
      removeTypename(formData)
    );

    if (this.isNew()) {
      const { data } = await saveProject({ variables: { input } });
      if (!data) return;

      const {
        projectCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess(getByPath('projectCreate', data));
        if (onSuccessCallback) {
          onSuccessCallback(data);
        }
      }
    } else if (projectId) {
      const { data } = await saveProject({ variables: { input, id: decodeId(projectId) } });
      if (!data) return;

      const {
        projectUpdate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess(getByPath('projectUpdate', data));
        if (onSuccessCallback) {
          onSuccessCallback(data);
        }
      }

      if (needDeletedFiles.length > 0) {
        const ids = needDeletedFiles.map(f => f.id);
        const deleteFilesResult: any = await deleteFiles({
          variables: {
            ids,
          },
        });
        showToastError({ intl, result: deleteFilesResult, entity: 'project' });
      }
    }
  };

  initAllValues = (
    { projectInfoState, projectTagsState, projectMilestonesState }: Object,
    project: Project | { id: string, tags?: Array<Tag>, milestones?: Array<Milestone> },
    timezone: string
  ) => {
    const {
      tags = [],
      milestones = [
        {
          id: uuid(),
          total: 0,
          completed: 0,
          dueDate: null,
          isCompleted: false,
          name: 'Milestone - 1',
          tasks: [],
          files: [],
        },
      ],
      ...info
    } = project;
    projectInfoState.initDetailValues(omit(info, ['ignoreTaskIds']), timezone);
    if (tags && Array.isArray(tags) && tags.length) {
      projectTagsState.initDetailValues(tags);
    }
    if (milestones && Array.isArray(milestones) && milestones.length) {
      projectMilestonesState.initDetailValues(milestones);
    }
    return null;
  };

  onFormReady = (
    { projectInfoState, projectTagsState, projectMilestonesState }: Object,
    project: Project | { id: string, tags?: Array<Tag>, milestones?: Array<Milestone> },
    timezone: string
  ) => {
    const hasInitialStateYet = projectInfoState.state.id || Object.keys(project).length === 0;
    if (hasInitialStateYet) return null;
    this.initAllValues(
      {
        projectInfoState,
        projectTagsState,
        projectMilestonesState,
      },
      project,
      timezone
    );
    return null;
  };

  onMutationCompleted = (
    result: { projectCreate: ProjectPayload } | { projectUpdate: ProjectPayload }
  ) => {
    const { intl } = this.props;

    if (showToastError({ intl, result, entity: 'project' })) {
      return;
    }

    if (getByPath('projectCreate.id', result)) {
      navigate(`/project/${encodeId(getByPath('projectCreate.id', result))}`);
    }
  };

  render() {
    const { projectId, isSlideView, onCancel, ...rest } = this.props;

    const isNew = this.isNew();
    let mutationKey = {};
    if (projectId && !isNew) {
      mutationKey = { key: decodeId(projectId) };
    }
    const CurrentNavBar = isSlideView ? SlideViewNavBar : NavBar;
    const CurrentLayout = isSlideView ? SlideViewLayout : React.Fragment;

    return (
      <UserConsumer>
        {({ user }) => (
          <Provider inject={[formContainer]}>
            <Mutation
              mutation={isNew ? createProjectMutation : updateProjectMutation}
              onCompleted={this.onMutationCompleted}
              {...mutationKey}
            >
              {(saveProject, { loading: isLoading, error: apiError }) => (
                <CurrentLayout>
                  <CurrentNavBar>
                    <EntityIcon icon="PROJECT" color="PROJECT" />
                    <BooleanValue>
                      {({ value: opened, set: slideToggle }) =>
                        !isNew && (
                          <>
                            <LogsButton
                              entityType="project"
                              entityId={projectId}
                              onClick={() => slideToggle(true)}
                            />
                            <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                              <SlideViewLayout>
                                {projectId && opened && (
                                  <>
                                    <SlideViewNavBar>
                                      <EntityIcon icon="LOGS" color="LOGS" />
                                    </SlideViewNavBar>

                                    <Content>
                                      <Timeline
                                        query={projectTimelineQuery}
                                        queryField="project"
                                        variables={{
                                          id: decodeId(projectId),
                                        }}
                                        entity={{
                                          projectId: decodeId(projectId),
                                        }}
                                        users={[]}
                                      />
                                    </Content>
                                  </>
                                )}
                              </SlideViewLayout>
                            </SlideView>
                          </>
                        )
                      }
                    </BooleanValue>
                    <Subscribe
                      to={[
                        ProjectInfoContainer,
                        ProjectTagsContainer,
                        ProjectMilestonesContainer,
                        FormContainer,
                      ]}
                    >
                      {(projectInfoState, projectTagsState, projectMilestonesState, form) => {
                        const isDirty =
                          projectInfoState.isDirty() ||
                          projectTagsState.isDirty() ||
                          projectMilestonesState.isDirty();

                        return (
                          <>
                            {isNew ? (
                              <CancelButton
                                onClick={() => (onCancel ? onCancel() : this.onCancel())}
                              />
                            ) : (
                              <>
                                {isDirty && (
                                  <ResetFormButton
                                    onClick={() => {
                                      this.initAllValues(
                                        {
                                          projectInfoState,
                                          projectTagsState,
                                          projectMilestonesState,
                                        },
                                        {
                                          ...projectInfoState.originalValues,
                                          ...projectTagsState.originalValues,
                                          ...projectMilestonesState.originalValues,
                                        },
                                        user.timezone
                                      );
                                      form.onReset();
                                    }}
                                  />
                                )}
                              </>
                            )}

                            {(isNew || isDirty) && (
                              <Mutation mutation={deleteManyFileMutation} {...mutationKey}>
                                {deleteFiles => (
                                  <SaveFormButton
                                    id="project_form_save_button"
                                    disabled={
                                      !form.isReady(
                                        {
                                          ...projectInfoState.state,
                                          ...projectTagsState.state,
                                          ...projectMilestonesState.state,
                                        },
                                        validator
                                      )
                                    }
                                    isLoading={isLoading}
                                    onClick={() => {
                                      this.onSave(
                                        {
                                          ...projectInfoState.originalValues,
                                          ...projectTagsState.originalValues,
                                          ...projectMilestonesState.originalValues,
                                          originalTasks: projectMilestonesState.originalTasks,
                                        },
                                        {
                                          ...projectInfoState.state,
                                          ...projectTagsState.state,
                                          ...projectMilestonesState.state,
                                        },
                                        saveProject,
                                        projectMilestonesState.state.needDeletedFiles,
                                        deleteFiles,
                                        updateProject => {
                                          this.initAllValues(
                                            {
                                              projectInfoState,
                                              projectTagsState,
                                              projectMilestonesState,
                                            },
                                            updateProject,
                                            user.timezone
                                          );
                                          form.onReset();
                                        },
                                        form.onErrors
                                      );
                                      this.onDeleteTask(projectMilestonesState.deleteTasks);
                                    }}
                                  />
                                )}
                              </Mutation>
                            )}
                            {projectId && !isDirty && !isNew && (
                              <ExportButton
                                type="Project"
                                exportQuery={projectExportQuery}
                                variables={{ id: decodeId(projectId) }}
                              />
                            )}
                          </>
                        );
                      }}
                    </Subscribe>
                  </CurrentNavBar>
                  <Content>
                    {apiError && <p>Error: Please try again.</p>}
                    {this.isNew() || !projectId ? (
                      <>
                        <ProjectForm isNew />
                        <Subscribe
                          to={[
                            ProjectInfoContainer,
                            ProjectTagsContainer,
                            ProjectMilestonesContainer,
                          ]}
                        >
                          {(projectInfoState, projectTagsState, projectMilestonesState) => {
                            const template = getByPath('location.state.template', rest) || {};
                            this.onFormReady(
                              {
                                projectInfoState,
                                projectTagsState,
                                projectMilestonesState,
                              },
                              {
                                ...template,
                                id: uuid(),
                              },
                              user.timezone
                            );
                            return null;
                          }}
                        </Subscribe>
                      </>
                    ) : (
                      <QueryForm
                        query={projectFormQuery}
                        entityId={projectId}
                        entityType="project"
                        onCompleted={logger.warn}
                        render={(project, isOwner) => (
                          <>
                            <ProjectForm project={project} isOwner={isOwner} />
                            <Subscribe
                              to={[
                                ProjectInfoContainer,
                                ProjectTagsContainer,
                                ProjectMilestonesContainer,
                              ]}
                            >
                              {(projectInfoState, projectTagsState, projectMilestonesState) =>
                                this.onFormReady(
                                  {
                                    projectInfoState,
                                    projectTagsState,
                                    projectMilestonesState,
                                  },
                                  project,
                                  user.timezone
                                )
                              }
                            </Subscribe>
                          </>
                        )}
                      />
                    )}
                  </Content>
                </CurrentLayout>
              )}
            </Mutation>
          </Provider>
        )}
      </UserConsumer>
    );
  }
}

export default injectIntl(ProjectFormModule);
