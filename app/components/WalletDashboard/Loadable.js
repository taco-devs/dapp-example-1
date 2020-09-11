/**
 *
 * Asynchronously loads the component for WalletDashboard
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
