/*
 *
 * InvestPage reducer
 *
 */
import { fromJS } from 'immutable';
import { DEFAULT_ACTION,
  GET_USER_STATS_REQUEST, GET_USER_STATS_SUCCESS, GET_USER_STATS_ERROR,
  GET_BALANCES_REQUEST, GET_BALANCES_SUCCESS, GET_BALANCES_ERROR,
  GET_ETH_PRICE, 
} from './constants';

export const initialState = fromJS({
  user: null,
  balances: null,
  eth_price: null,
  isLoadingBalances: null,
  balancesError: null,
});


function statsReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION: 
      return state;
    case GET_USER_STATS_REQUEST: 
      return state;
    case GET_USER_STATS_SUCCESS: 
      return state.set('user', action.user);
    case GET_USER_STATS_ERROR: 
      return state;
    case GET_BALANCES_REQUEST: 
      return state
      .set('isLoadingBalances', true)
      .set('balancesError', null);
    case GET_BALANCES_SUCCESS: 
      return state
        .set('isLoadingBalances', false)
        .set('balances', action.balances);
    case GET_BALANCES_ERROR: 
      return state
        .set('isLoadingBalances', false)
        .set('balancesError', action.error);
    case GET_ETH_PRICE: 
      return state.set('eth_price', action.eth_price);
    default:
      return state;
  }
}

export default statsReducer;
