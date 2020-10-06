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

export {
  makeSelectCurrrentNetwork, 
  makeSelectCurrrentSwap
};
