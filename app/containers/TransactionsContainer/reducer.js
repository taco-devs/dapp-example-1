/*
 *
 * TransactionsContainer reducer
 *
 */
import { fromJS } from 'immutable';
import { 
  GET_TRANSACTIONS_REQUEST, GET_TRANSACTIONS_SUCCESS, GET_TRANSACTIONS_ERROR,
  CHANGE_PAGINATION
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  transactions: null,
  pagination: 0,
  error: null,
});


function transactionsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_TRANSACTIONS_REQUEST: 
      return state
        .set('error', null)
        .set('isLoading', true);
    case GET_TRANSACTIONS_SUCCESS: 
      return state
        .set('isLoading', false)
        .set('transactions', action.transactions);
    case GET_TRANSACTIONS_ERROR: 
      return state
        .set('error', action.error)
        .set('isLoading', false);
    case CHANGE_PAGINATION: 
      return state.set('pagination', action.pagination);
    default:
      return state;
  }
}

export default transactionsReducer;
