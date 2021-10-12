// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { MilestoneCard } from 'components/Cards';
import { useEntityHasPermissions } from 'contexts/Permissions';
import { PROJECT_GET } from 'modules/permission/constants/project';

type Props = {
  milestone: Object,
};

const ParentMilestoneCard = ({ milestone }: Props) => {
  const hasPermissions = useEntityHasPermissions(milestone);

  return (
    <MilestoneCard
      milestone={milestone}
      onClick={() => {
        if (hasPermissions(PROJECT_GET) && !!milestone?.project?.id) {
          navigate(`/project/${encodeId(milestone?.project?.id)}`);
        }
      }}
    />
  );
};

export default ParentMilestoneCard;
