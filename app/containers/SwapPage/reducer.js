/*
 *
 * TransactionsContainer reducer
 *
 */
import { fromJS } from 'immutable';
import { 
  GET_POOLS_REQUEST, GET_POOLS_ERROR, GET_POOLS_SUCCESS
} from './constants';

export const initialState = fromJS({
  pools: null,
  tokens: null,
});


function swapsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POOLS_REQUEST: 
      return state
    case GET_POOLS_SUCCESS: 
      return state
        .set('pools', action.pools)
        .set('tokens', action.tokens);
    case GET_POOLS_ERROR: 
      return state
    default:
      return state;
  }
}

export default swapsReducer;
