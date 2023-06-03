import axios from "axios";
import { Meteor } from "meteor/meteor";

const PROXY_HOST = Meteor.settings.private.app.proxyHost || "";

export default async function insertDocumentWithURL({ files, meetingID }) {
  const params = {
    meetingID,
    apiCall: "insertDocument",
  };

  const res = await axios.post(
    `${PROXY_HOST}/bigbluebutton/api`,
    { files: JSON.stringify(files) },
    {
      params,
    },
  );

  return res.data;
}
