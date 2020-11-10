import { createSelector } from 'reselect';

const selectSwaps = state => state.swapPage;

const makeSelectPools = () =>
  createSelector(selectSwaps, swapsState => {
      return swapsState.get('pools')
    }
  );

const makeSelectTokens = () =>
  createSelector(selectSwaps, swapsState => {
      return swapsState.get('tokens')
    }
  );

export { 
  makeSelectPools,
  makeSelectTokens
};