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

const makeSelectRelevantPrices = () =>
  createSelector(selectStatsPage, statsState => {
      return statsState.get('relevant_prices')
    }
  );

const makeSelectStatus = () =>
  createSelector(selectStatsPage, statsState => {
      return statsState.get('status')
    }
  );

const makeSelectIsLoadingTVL = () =>
  createSelector(selectStatsPage, statsState => {
      return statsState.get('isLoadingTVL')
    }
  );

const makeSelectTvlError = () =>
  createSelector(selectStatsPage, statsState => {
      return statsState.get('tvl_error')
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
  makeSelectPrices,
  makeSelectStatus,
  makeSelectRelevantPrices,
  makeSelectTvlError,
  makeSelectIsLoadingTVL
};