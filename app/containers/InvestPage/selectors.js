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


export { 
  makeSelectPagination,
  makeSelectSearch
};