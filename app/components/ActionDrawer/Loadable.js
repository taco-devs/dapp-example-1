/**
 *
 * Asynchronously loads the component for ActionDrawer
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
