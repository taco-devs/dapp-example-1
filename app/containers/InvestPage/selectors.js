import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the investPage state domain
 */

const selectInvestPageDomain = state => state.investPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by InvestPage
 */

const makeSelectInvestPage = () =>
  createSelector(
    selectInvestPageDomain,
    substate => substate,
  );

export default makeSelectInvestPage;
export { selectInvestPageDomain };
