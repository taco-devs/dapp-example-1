/*
 *
 * InvestPage reducer
 *
 */
import { fromJS } from 'immutable';
import { 
  DEFAULT_ACTION, CHANGE_PAGE, SEARCH, 
  GET_TOKENS_REQUEST, GET_TOKENS_SUCCESS, GET_TOKENS_ERROR,
  GET_TOKEN_STATS_REQUEST, GET_TOKEN_STATS_SUCCESS, GET_TOKEN_STATS_ERROR
} from './constants';

export const initialState = fromJS({
  tokens: null,
  isLoadingChart: false,
  pagination: 0,
  search: null,
  tokenData: null,
  error: null,
  errorTokenData: null,
});


function investReducer(state = initialState, action) {
  switch (action.type) {
    case GET_TOKENS_REQUEST:
      return state
        .set('error', null);
    case GET_TOKENS_SUCCESS:
      return state
        .set('tokens', action.tokens);
    case GET_TOKENS_ERROR:
      return state
        .set('error', action.error);
    case GET_TOKEN_STATS_REQUEST:
      return state
        .set('tokenData', null)
        .set('isLoadingChart', true);
    case GET_TOKEN_STATS_SUCCESS:
      return state
        .set('isLoadingChart', false)
        .set('tokenData', action.tokenData);
    case GET_TOKEN_STATS_ERROR:
      return state;
    case CHANGE_PAGE:
      return state.set('pagination', action.pagination);
    case SEARCH: 
      return state.set('search', action.search);
    default:
      return state;
  }
}

export default investReducer;
