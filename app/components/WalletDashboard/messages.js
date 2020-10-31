/*
 * WalletDashboard Messages
 *
 * This contains all the text for the WalletDashboard component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.WalletDashboard';

export default defineMessages({
  balance: {
    id: `${scope}.balance`,
    defaultMessage: 'PERSONAL HOLDINGS',
  },
  more: {
    id: `${scope}.more`,
    defaultMessage: 'MORE >',
  },
});
