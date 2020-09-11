/**
 *
 * Asynchronously loads the component for ConnectWallet
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
