// @flow
import gql from 'graphql-tag';
import { badRequestFragment } from 'graphql';
import {
  parseGenericField,
  parseArrayOfChildrenField,
  parseArrayOfIdsField,
  parseMemoField,
} from 'utils/data';
import { getByPathWithDefault } from 'utils/fp';

export const createTaskTemplateMutation = gql`
  mutation taskTemplateCreate($input: TaskTemplateCreateInput!) {
    taskTemplateCreate(input: $input) {
      ... on TaskTemplate {
        id
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
`;

export const updateTaskTemplateMutation = gql`
  mutation taskTemplateUpdate($id: ID!, $input: TaskTemplateUpdateInput!) {
    taskTemplateUpdate(id: $id, input: $input) {
      ... on TaskTemplate {
        id
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
`;

export const prepareParsedTaskTemplate = (originalValues: ?Object, newValues: Object): Object => ({
  name: newValues.name,
  entityType: newValues.entityType,
  ...parseMemoField(
    'description',
    getByPathWithDefault(null, 'description', originalValues),
    newValues.description
  ),
  ...parseArrayOfChildrenField(
    'tasks',
    getByPathWithDefault([], 'tasks', originalValues),
    newValues.tasks,
    (oldTask: ?Object, newTask: Object) => {
      return {
        ...(oldTask ? { id: oldTask.id } : {}),
        ...parseGenericField('name', getByPathWithDefault(null, 'name', oldTask), newTask.name),
        ...parseArrayOfIdsField(
          'assignedToIds',
          getByPathWithDefault([], 'assignedTo', oldTask),
          newTask.assignedTo
        ),
        ...parseMemoField(
          'description',
          getByPathWithDefault(null, 'description', oldTask),
          newTask.description
        ),
        ...parseArrayOfIdsField('tagIds', getByPathWithDefault([], 'tags', oldTask), newTask.tags),
      };
    }
  ),
});
