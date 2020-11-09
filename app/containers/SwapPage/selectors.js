import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the swapPage state domain
 */

const selectSwapPageDomain = state => state.swapPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SwapPage
 */

const makeSelectSwapPage = () =>
  createSelector(
    selectSwapPageDomain,
    substate => substate,
  );

export default makeSelectSwapPage;
export { selectSwapPageDomain };
