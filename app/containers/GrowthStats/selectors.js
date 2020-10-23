import { createSelector } from 'reselect';

const selectStatsPage = state => state.statsPage;

const makeSelectUser = () =>
  createSelector(selectStatsPage, statsState => {
      return statsState.get('user')
    }
  );

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

const makeSelectBalancesError = () =>
  createSelector(selectStatsPage, statsState => {
      return statsState.get('balancesError')
    }
  );

const makeSelectIsLoadingBalances = () =>
  createSelector(selectStatsPage, statsState => {
      return statsState.get('isLoadingBalances')
    }
  );

export { 
  makeSelectBalancesError,
  makeSelectIsLoadingBalances,
  makeSelectUser,
  makeSelectBalances,
  makeSelectEthPrice
};