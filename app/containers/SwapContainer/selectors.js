import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the swapContainer state domain
 */

const selectSwapContainerDomain = state => state.swapContainer || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SwapContainer
 */

const makeSelectSwapContainer = () =>
  createSelector(
    selectSwapContainerDomain,
    substate => substate,
  );

export default makeSelectSwapContainer;
export { selectSwapContainerDomain };
