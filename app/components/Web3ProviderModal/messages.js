/*
 * Web3ProviderModal Messages
 *
 * This contains all the text for the Web3ProviderModal component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.Web3ProviderModal';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the Web3ProviderModal component!',
  },
  connect: {
    id: `${scope}.connect`,
    defaultMessage: 'Connect Wallet',
  },
});
