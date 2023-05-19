import React, { useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';

function GoogleDriveUploader({ onSelectFiles }) {
  const [openPicker, authResponse] = useDrivePicker();
  const [loading, setLoading] = useState(false);
  const BASE_NAME = Meteor.settings.public.app.basename;

  const ICONS_PATH = `${BASE_NAME}/resources/images/icons`;
  // const customViewsArray = [new google.picker.DocsView()]; // custom view

  const handleOpenPicker = () => {
    openPicker({
      clientId: '753430601932-73fsb3o0oapabrf88j6978glgc0nqhh4.apps.googleusercontent.com',
      developerKey: 'AIzaSyA_Zb0roinIj-ITlgvAFJWF440HCPTnjeQ',
      viewId: 'DOCS',
      // token: token, // pass oauth token in case you already have one
      supportDrives: true,
      multiselect: true,
      setIncludeFolders: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: async (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button');
        }
        if (data.docs?.length > 0) {
          console.log(data.docs);
          const choosenFiles = data.docs.map(({
            url, name, id,
          }) => ({
            uploadUrl: `https://drive.google.com/u/0/uc?id=${id}`,
            url,
            name,
            id,
          }));
          setLoading(true);
          await onSelectFiles(choosenFiles);
          setLoading(false);
        }
      },
    });
  };

  return (
    <div
      onClick={() => handleOpenPicker()}
      style={{
        borderRadius: 5,
        backgroundColor: '#f1f1f1',
        cursor: 'pointer',
      }}
    >
      <img src={`${ICONS_PATH}/google_drive.png`} alt="Google drive" width={100} height={100} style={{ objectFit: 'contain' }} />
    </div>
  );
}

export default GoogleDriveUploader;
