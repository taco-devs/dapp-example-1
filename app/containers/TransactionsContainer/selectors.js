import { createSelector } from 'reselect';

const selectTransactions = state => state.transactions;

const makeSelectTransactions = () =>
  createSelector(selectTransactions, transactionsState => {
      return transactionsState.get('transactions')
    }
  );

export { 
  makeSelectTransactions
};