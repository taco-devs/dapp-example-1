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

const makeSelectTvl = () =>
  createSelector(selectStatsPage, statsState => {
      return statsState.get('tvl')
    }
  );

const makeSelectTvlHistory = () =>
  createSelector(selectStatsPage, statsState => {
      return statsState.get('tvl_history')
    }
  );

const makeSelectPrices = () =>
  createSelector(selectStatsPage, statsState => {
      return statsState.get('prices')
    }
  );

export { 
  makeSelectBalancesError,
  makeSelectIsLoadingBalances,
  makeSelectUser,
  makeSelectBalances,
  makeSelectEthPrice,
  makeSelectTvl,
  makeSelectTvlHistory,
  makeSelectPrices
};