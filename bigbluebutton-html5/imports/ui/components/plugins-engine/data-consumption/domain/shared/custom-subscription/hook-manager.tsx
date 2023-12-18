import { useEffect, useState } from 'react';
import { useSubscription, gql } from '@apollo/client';
import logger from '/imports/startup/client/logger';
import { CustomSubscriptionArguments } from 'bigbluebutton-html-plugin-sdk/dist/cjs/data-consumption/domain/shared/custom-subscription/types';
import { UpdatedEventDetails } from 'bigbluebutton-html-plugin-sdk/dist/cjs/core/types';
import {
  Hooks, HookEvents,
} from 'bigbluebutton-html-plugin-sdk/dist/cjs/core/enum';

import { HookWithArgumentsContainerProps } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomSubscriptionHookContainer = (props: HookWithArgumentsContainerProps) => {
  const { hookArguments } = props;
  const { query: queryFromPlugin, variables } = hookArguments;

  const [sendSignal, setSendSignal] = useState(false);

  let customSubscriptionData: any;
  try {
    const subscriptionResult = useSubscription(gql`${queryFromPlugin}`, {
      variables,
    });
    customSubscriptionData = subscriptionResult;
  } catch (err) {
    logger.error(
      `Error while querying custom subscriptions for plugins (query: ${queryFromPlugin}) (Error: ${err})`,
    );
    customSubscriptionData = 'Error';
  }

  const updatePresentationForPlugin = () => {
    window.dispatchEvent(
      new CustomEvent<UpdatedEventDetails<any>>(
        HookEvents.UPDATED,
        {
          detail: {
            data: customSubscriptionData,
            hook: Hooks.CUSTOM_SUBSCRIPTION,
            hookArguments: {
              query: queryFromPlugin,
              variables,
            } as CustomSubscriptionArguments,
          } as UpdatedEventDetails<any>,
        },
      ),
    );
  };

  useEffect(() => {
    updatePresentationForPlugin();
  }, [customSubscriptionData, sendSignal]);

  useEffect(() => {
    const updateHookUseCustomSubscription = (() => {
      setSendSignal((previous) => !previous);
    }) as EventListener;
    window.addEventListener(
      HookEvents.SUBSCRIBED, updateHookUseCustomSubscription,
    );
    return () => {
      window.removeEventListener(
        HookEvents.SUBSCRIBED, updateHookUseCustomSubscription,
      );
    };
  }, []);

  return null;
};

export default CustomSubscriptionHookContainer;
