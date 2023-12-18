/* eslint-disable no-undef */
// Rule applied because EventListener is not undefined at all times.
import React, { useEffect, useState } from 'react';
import { CustomSubscriptionArguments } from 'bigbluebutton-html-plugin-sdk/dist/cjs/data-consumption/domain/shared/custom-subscription/types';
import { makeCustomHookIdentifierFromArgs } from 'bigbluebutton-html-plugin-sdk/dist/cjs/data-consumption/utils';
import {
  Hooks, HookEvents,
} from 'bigbluebutton-html-plugin-sdk/dist/cjs/core/enum';
import { HookEventWrapper, SubscribedEventDetails } from 'bigbluebutton-html-plugin-sdk/dist/cjs/core/types';
import LoadedUserListHookContainer from '../domain/users/loaded-user-list/hook-manager';
import CurrentUserHookContainer from '../domain/users/current-user/hook-manager';
import CustomSubscriptionHookContainer from '../domain/shared/custom-subscription/hook-manager';

import { ObjectToCustomHookContainerMap, HookWithArgumentsContainerProps, HookWithArgumentContainerToRender } from '../domain/shared/custom-subscription/types';
import CurrentPresentationHookContainer from '../domain/presentations/current-presentation/hook-manager';

const hooksMap:{
  [key: string]: React.FunctionComponent
} = {
  [Hooks.LOADED_USER_LIST]: LoadedUserListHookContainer,
  [Hooks.CURRENT_USER]: CurrentUserHookContainer,
  [Hooks.CURRENT_PRESENTATION]: CurrentPresentationHookContainer,
};

const HooksMapWithArguments:{
  [key: string]: React.FunctionComponent<HookWithArgumentsContainerProps>
} = {
  [Hooks.CUSTOM_SUBSCRIPTION]: CustomSubscriptionHookContainer,
};

const PluginHooksHandlerContainer: React.FC = () => {
  const [
    hookUtilizationCount,
    setHookUtilizationCount,
  ] = useState(new Map<string, number>());

  const [
    hookWithArgumentUtilizationCount,
    setHookWithArgumentUtilizationCount,
  ] = useState(new Map<string, Map<string, ObjectToCustomHookContainerMap>>());

  useEffect(() => {
    const updateHookUsage = (
      hookName: string, delta: number, hookArguments?: CustomSubscriptionArguments,
    ): void => {
      if (hookName !== Hooks.CUSTOM_SUBSCRIPTION) {
        setHookUtilizationCount((mapObj) => {
          const newMap = new Map<string, number>(mapObj.entries());
          newMap.set(hookName, (mapObj.get(hookName) || 0) + delta);
          return newMap;
        });
      } else {
        setHookWithArgumentUtilizationCount((mapObj) => {
          if (hookArguments) {
            const hookArgumentsAsKey = makeCustomHookIdentifierFromArgs(hookArguments);
            // Create object from the hook with argument
            const mapToBeSet = new Map<string, ObjectToCustomHookContainerMap>(mapObj.get(hookName)?.entries());
            mapToBeSet.set(hookArgumentsAsKey, {
              count: (mapObj.get(hookName)?.get(hookArgumentsAsKey)?.count || 0) + delta,
              hookArguments,
            } as ObjectToCustomHookContainerMap);

            // Create new map with argument
            const newMap = new Map<string, Map<string, ObjectToCustomHookContainerMap>>(mapObj.entries());
            newMap.set(hookName, mapToBeSet);
            return newMap;
          } return mapObj;
        });
      }
    };

    const subscribeHandler: EventListener = (
      (event: HookEventWrapper<void>) => {
        let hookArguments: CustomSubscriptionArguments | undefined;
        if (event.detail.hook === Hooks.CUSTOM_SUBSCRIPTION) {
          const detail = event.detail as SubscribedEventDetails;
          hookArguments = detail.hookArguments as CustomSubscriptionArguments;
        }
        updateHookUsage(event.detail.hook, 1, hookArguments);
      }) as EventListener;
    const unsubscribeHandler: EventListener = (
      (event: HookEventWrapper<void>) => {
        let hookArguments: CustomSubscriptionArguments | undefined;
        if (event.detail.hook === Hooks.CUSTOM_SUBSCRIPTION) {
          const detail = event.detail as SubscribedEventDetails;
          hookArguments = detail.hookArguments as CustomSubscriptionArguments;
        }
        updateHookUsage(event.detail.hook, -1, hookArguments);
      }) as EventListener;

    window.addEventListener(HookEvents.SUBSCRIBED, subscribeHandler);
    window.addEventListener(HookEvents.UNSUBSCRIBED, unsubscribeHandler);
    return () => {
      window.removeEventListener(HookEvents.SUBSCRIBED, subscribeHandler);
      window.removeEventListener(HookEvents.UNSUBSCRIBED, unsubscribeHandler);
    };
  }, []);

  const HooksWithArgumentContainerToRun: HookWithArgumentContainerToRender[] = [];
  Object.keys(HooksMapWithArguments).forEach((hookName) => {
    if (hookWithArgumentUtilizationCount.get(hookName)) {
      hookWithArgumentUtilizationCount.get(hookName)?.forEach((object) => {
        if (object.count > 0) {
          HooksWithArgumentContainerToRun.push({
            componentToRender: HooksMapWithArguments[hookName],
            hookArguments: object.hookArguments,
          });
        }
      });
    }
  });

  return (
    <>
      {
        Object.keys(hooksMap)
          .filter((hookName: string) => hookUtilizationCount.get(hookName)
            && hookUtilizationCount.get(hookName)! > 0)
          .map((hookName: string) => {
            const HookComponent = hooksMap[hookName];
            return <HookComponent key={hookName} />;
          })
      }
      {
        HooksWithArgumentContainerToRun.map((hookWithArguments) => {
          const HookComponent = hookWithArguments.componentToRender;
          return (
            <HookComponent
              key={makeCustomHookIdentifierFromArgs(hookWithArguments.hookArguments)}
              hookArguments={hookWithArguments.hookArguments}
            />
          );
        })
      }
    </>
  );
};

export default PluginHooksHandlerContainer;
