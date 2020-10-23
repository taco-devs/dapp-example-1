import { createSelector } from 'reselect';

const selectInvestPage = state => state.investPage;

const makeSelectTokens = () =>
  createSelector(selectInvestPage, investState => {
      return investState.get('tokens')
    }
  );

const makeSelectPagination = () =>
  createSelector(selectInvestPage, investState => {
      return investState.get('pagination')
    }
  );

const makeSelectSearch = () =>
  createSelector(selectInvestPage, investState => {
      return investState.get('search')
    }
  );

const makeSelectIsLoadingChart = () =>
  createSelector(selectInvestPage, investState => {
      return investState.get('isLoadingChart')
    }
  );

const makeSelectTokenData = () =>
  createSelector(selectInvestPage, investState => {
      return investState.get('tokenData')
    }
  );

const makeSelectError = () =>
  createSelector(selectInvestPage, investState => {
      return investState.get('error')
    }
  );

const makeSelectErrorTokenData = () =>
  createSelector(selectInvestPage, investState => {
      return investState.get('errorTokenData')
    }
  );


export { 
  makeSelectTokens,
  makeSelectPagination,
  makeSelectSearch,
  makeSelectIsLoadingChart,
  makeSelectTokenData,
  makeSelectError,
  makeSelectErrorTokenData
};