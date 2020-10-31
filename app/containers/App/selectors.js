/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGlobal = state => state.global || initialState;

const selectRouter = state => state.router;

const makeSelectCurrrentNetwork = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.get('network'),
  );

const makeSelectCurrrentSwap = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.get('currentSwap'),
  );

const makeSelectCurrrentApproval = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.get('currentApproval'),
  );

// Hide balances
const makeSelectHideBalances = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.get('hideBalances'),
  );

export {
  makeSelectCurrrentNetwork, 
  makeSelectCurrrentSwap,
  makeSelectCurrrentApproval,
  makeSelectHideBalances
};
