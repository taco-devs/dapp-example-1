import { createSelector } from 'reselect';

const selectStatsPage = state => state.statsPage;

const makeSelectBalances = () =>
  createSelector(selectStatsPage, statsState => {
      return statsState.get('balances')
    }
  );

const makeSelectEthPrice = () =>
  createSelector(selectStatsPage, statsState => {
      return statsState.get('eth_price')
    }
  );

export { 
  makeSelectBalances,
  makeSelectEthPrice
};