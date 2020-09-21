/*
 * GrowthDashboard Messages
 *
 * This contains all the text for the GrowthDashboard component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.GrowthDashboard';

export default defineMessages({
  tvl: {
    id: `${scope}.header`,
    defaultMessage: '{growth} ( {value} )',
  },
  more: {
    id: `${scope}.header`,
    defaultMessage: 'MORE >',
  },
});
