import { createSelector } from 'reselect';

const selectBalancePage = state => state.balancePage;

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
};