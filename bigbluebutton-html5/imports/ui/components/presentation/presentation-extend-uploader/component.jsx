import useDrivePicker from 'react-google-drive-picker';
import React, { useState } from 'react';

function GoogleDriveUploader({ onSelectFile }) {
  const [openPicker, authResponse] = useDrivePicker();
  const [loading, setLoading] = useState(false);
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
            embedUrl, url, name, id,
          }) => ({
            uploadUrl: `https://drive.google.com/u/0/uc?id=${id}`,
            url,
            name,
            id,
          }));
          setLoading(true);
          await onSelectFile(choosenFiles);
          setLoading(false);
        }
      },
    });
  };

  return (
    <div>
      {loading && <p>Loading documents...</p>}
      <button onClick={() => handleOpenPicker()}>Open Picker</button>
    </div>
  );
}

export default GoogleDriveUploader;
