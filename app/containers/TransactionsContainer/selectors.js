import { createSelector } from 'reselect';

const selectTransactions = state => state.transactions;

const makeSelectTransactions = () =>
  createSelector(selectTransactions, transactionsState => {
      return transactionsState.get('transactions')
    }
  );

const makeSelectPagination = () =>
  createSelector(selectTransactions, transactionsState => {
      return transactionsState.get('pagination')
    }
  );

const makeSelectIsLoading = () =>
  createSelector(selectTransactions, transactionsState => {
      return transactionsState.get('isLoading')
    }
  );

const makeSelectError = () =>
  createSelector(selectTransactions, transactionsState => {
      return transactionsState.get('error')
    }
  );

export { 
  makeSelectTransactions,
  makeSelectPagination,
  makeSelectIsLoading,
  makeSelectError,
};