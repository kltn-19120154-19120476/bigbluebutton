import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import Icon from '/imports/ui/components/common/icon/component';
import { canOpenDropbox } from 'react-cloud-chooser';
import { CircularProgress } from '@material-ui/core';

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

const DropboxUploader = ({ onSelectFiles }) => {
  const toastId = useRef(null);
  const handleChooseFiles = async (files) => {
    const choosenFiles = files.map((file) => ({ uploadUrl: file.link.replace('?dl=0', '?dl=1'), name: file.name }));
    toastId.current = toast.info(
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress size={14} />
          <h3 style={{ marginLeft: 10 }}>Downloading files...</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {choosenFiles.map((file) => (
            <div style={{
              padding: '5px 0', display: 'flex', alignItems: 'center', gap: 10,
            }}
            >
              <Icon iconName="file" />
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      </div>,
      {
        autoClose: false,
      },
    );
    await onSelectFiles(choosenFiles);
    setTimeout(() => toast.dismiss(toastId.current), choosenFiles.length * 3000);
  };

  return <DropboxOpenBtn appKey="pxonfb5c72b1tr7" success={handleChooseFiles} extensions=".pdf,.docs,.doc,.ppt,.pptx" multiselect />;
};

export default DropboxUploader;
