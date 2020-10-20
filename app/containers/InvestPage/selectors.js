import { createSelector } from 'reselect';

const selectInvestPage = state => state.investPage;

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


export { 
  makeSelectPagination,
  makeSelectSearch,
  makeSelectIsLoadingChart,
  makeSelectTokenData
};