/*
 * Navbar Messages
 *
 * This contains all the text for the Navbar component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.Navbar';

export default defineMessages({
  invest: {
    id: `${scope}.header`,
    defaultMessage: 'INVEST',
  },
  vote: {
    id: `${scope}.vote`,
    defaultMessage: 'VOTE',
  },
  transactions: {
    id: `${scope}.transactions`,
    defaultMessage: 'TRANSACTIONS',
  },
  balance: {
    id: `${scope}.balance`,
    defaultMessage: 'BALANCE',
  },
});
