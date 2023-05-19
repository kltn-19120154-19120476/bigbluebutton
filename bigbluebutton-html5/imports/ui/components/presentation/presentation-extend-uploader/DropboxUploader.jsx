import React from 'react';

import {
  canOpenDropbox,
} from 'react-cloud-chooser';

const DropboxBtn = ({ openDropbox, isDropboxLoading }) => {
  const BASE_NAME = Meteor.settings.public.app.basename;
  const ICONS_PATH = `${BASE_NAME}/resources/images/icons`;
  return (
    <div
      onClick={openDropbox}
      style={{
        borderRadius: 5,
        backgroundColor: '#f1f1f1',
        cursor: 'pointer',
      }}
    >
      <img src={`${ICONS_PATH}/dropbox.jpg`} alt="Google drive" width={100} height={100} style={{ objectFit: 'contain' }} />
    </div>
  );
};

const DropboxOpenBtn = canOpenDropbox(DropboxBtn);

const DropboxUploader = ({ onSelectFiles }) => (
  <>
    <DropboxOpenBtn
      appKey="pxonfb5c72b1tr7"
      success={(files) => {
        const choosenFiles = files.map((file) => ({ uploadUrl: file.link.replace('?dl=0', '?dl=1'), name: file.name }));
        onSelectFiles(choosenFiles);
      }}
      cancel={() => console.log('cancel pressed')}
      extensions=".pdf,.jpg"
    />
  </>
);

export default DropboxUploader;
