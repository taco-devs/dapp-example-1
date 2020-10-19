/*
 *
 * TransactionsContainer reducer
 *
 */
import { fromJS } from 'immutable';
import { 
  GET_TRANSACTIONS_REQUEST, GET_TRANSACTIONS_SUCCESS, GET_TRANSACTIONS_ERROR
} from './constants';

export const initialState = fromJS({
  transactions: null
});


function transactionsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_TRANSACTIONS_REQUEST: 
      return state;
    case GET_TRANSACTIONS_SUCCESS: 
      return state.set('transactions', action.transactions);
    case GET_TRANSACTIONS_ERROR: 
      return state;
    default:
      return state;
  }
}

export default transactionsReducer;
