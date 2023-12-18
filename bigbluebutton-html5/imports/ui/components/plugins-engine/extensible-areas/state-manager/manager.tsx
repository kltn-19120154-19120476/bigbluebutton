import * as React from 'react';
import { PluginProvidedUiItemDescriptor } from 'bigbluebutton-html-plugin-sdk/dist/cjs/extensible-areas/base';

import PresentationToolbarPluginStateContainer from '../components/presentation-toolbar/manager';
import UserListDropdownPluginStateContainer from '../components/user-list-dropdown/manager';
import ActionButtonDropdownPluginStateContainer from '../components/action-button-dropdown/manager';
import AudioSettingsDropdownPluginStateContainer from '../components/audio-settings-dropdown/manager';
import ActionBarPluginStateContainer from '../components/action-bar/manager';
import PresentationDropdownPluginStateContainer from '../components/presentation-dropdown/manager';
import NavBarPluginStateContainer from '../components/nav-bar/manager';
import OptionsDropdownPluginStateContainer from '../components/options-dropdown/manager';
import CameraSettingsDropdownPluginStateContainer from '../components/camera-settings-dropdown/manager';
import UserCameraDropdownPluginStateContainer from '../components/user-camera-dropdown/manager';
import UserListItemAdditionalInformationPluginStateContainer from '../components/user-list-item-additional-information/manager';
import {
  ExtensibleArea, ExtensibleAreaStateManagerProps,
  ExtensibleAreaComponentManager, ExtensibleAreaMap,
} from '../types';

const extensibleAreaMap: ExtensibleAreaMap = {};

const extensibleAreaComponentManagers: ExtensibleAreaComponentManager[] = [
  PresentationToolbarPluginStateContainer,
  UserListDropdownPluginStateContainer,
  ActionButtonDropdownPluginStateContainer,
  AudioSettingsDropdownPluginStateContainer,
  ActionBarPluginStateContainer,
  PresentationDropdownPluginStateContainer,
  NavBarPluginStateContainer,
  OptionsDropdownPluginStateContainer,
  CameraSettingsDropdownPluginStateContainer,
  UserCameraDropdownPluginStateContainer,
  UserListItemAdditionalInformationPluginStateContainer,
];

function generateItemWithId<T extends PluginProvidedUiItemDescriptor>(
  item: T, index: number,
): T {
  item.setItemId(`${index}`);
  return item;
}

const ExtensibleAreaStateManager = (props: ExtensibleAreaStateManagerProps) => {
  const {
    uuid,
    pluginApi,
  } = props;
  if (!extensibleAreaMap[uuid]) {
    extensibleAreaMap[uuid] = {} as ExtensibleArea;
  }

  return (
    <>
      {
        extensibleAreaComponentManagers.map(
          (ExtensibleAreaComponentManagerChild: ExtensibleAreaComponentManager, index: number) => (
            <ExtensibleAreaComponentManagerChild
              {
                ...{
                  key: `${uuid}-${index}`,
                  uuid,
                  generateItemWithId,
                  extensibleAreaMap,
                  pluginApi,
                }
              }
            />
          ),
        )
      }
    </>
  );
};

export default ExtensibleAreaStateManager;
