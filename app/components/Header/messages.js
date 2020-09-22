/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.components.Header';

export default defineMessages({
  home: {
    id: `${scope}.home`,
    defaultMessage: 'Home',
  },
  features: {
    id: `${scope}.features`,
    defaultMessage: 'Features',
  },
  invest: {
    id: `${scope}.invest`,
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
