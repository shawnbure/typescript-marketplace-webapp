import * as faIcons from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ACTIONS_CONSTANTS } from 'constants/index';
export interface ToolbarAction {
    title: string;
    actionTrigger: string;
    icon: IconDefinition;
}

export const toolbarSwitches: Array<string> = ['output', 'debug console'];

export const toolbarActions: Array<ToolbarAction> = [
    {
        title: 'Toggle theme (Dark/Light)',
        icon: faIcons.faAdjust,
        actionTrigger: ACTIONS_CONSTANTS.LOGIN
    },
];

// export const CAROUSEL_IMGS_SRC = [
//     './img/carousel/1.png',
// ];
