/*
 *
 * InvestPage reducer
 *
 */
import { fromJS } from 'immutable';
import { DEFAULT_ACTION,
  GET_USER_STATS_REQUEST, GET_USER_STATS_SUCCESS, GET_USER_STATS_ERROR,
  GET_BALANCES_REQUEST, GET_BALANCES_SUCCESS, GET_BALANCES_ERROR,
  GET_PRICES_REQUEST, GET_PRICES_SUCCESS, GET_PRICES_ERROR,
  GET_ETH_PRICE,
  GET_TVL_REQUEST, GET_TVL_SUCCESS, GET_TVL_ERROR,
} from './constants';

export const initialState = fromJS({
  status: null,
  user: null,
  balances: null,
  eth_price: null,
  isLoadingBalances: false,
  balancesError: null,
  tvl: null,
  tvl_history: null,
  prices: null,
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
    case GET_PRICES_REQUEST: 
      return state;
    case GET_PRICES_SUCCESS: 
      return state.set('prices', action.prices);
    case GET_PRICES_ERROR: 
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
    case GET_TVL_REQUEST: 
      return state;
    case GET_TVL_SUCCESS: 
      return state
        .set('tvl', action.tvl)
        .set('tvl_history', action.tvl_history)
    case GET_TVL_ERROR: 
      return state
        .set('error', action.error);
    case GET_ETH_PRICE: 
      return state.set('eth_price', action.eth_price);
    default:
      return state;
  }
}

export default statsReducer;
