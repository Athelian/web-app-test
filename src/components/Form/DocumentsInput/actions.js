// @flow
import Raven from 'raven-js';
import { isDevEnvironment } from 'utils/env';
import { getAuthToken } from 'utils/auth';
import logger from 'utils/logger';
import axios from 'axios';

export const uploadDocument = (
  folder: string,
  file: File,
  onProgress: any => void,
  onError: any => void,
  onComplete: any => void
) => {
  const form = new FormData();
  form.append('file', file);

  axios({
    url: `${process.env.ZENPORT_FS_URL || ''}/${folder}`,
    method: 'post',
    data: form,
    responseType: 'text',
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    onUploadProgress(progressEvent) {
      onProgress(progressEvent);
    },
  })
    .then(response => onComplete(response.data))
    .catch(err => {
      if (!isDevEnvironment) {
        Raven.captureException(err);
      } else {
        logger.error(err);
      }
      onError(err);
    });
};

export default uploadDocument;
