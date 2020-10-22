/*
 *
 * InvestPage reducer
 *
 */
import { fromJS } from 'immutable';
import { 
  DEFAULT_ACTION, CHANGE_PAGE, SEARCH, 
  GET_TOKEN_STATS_REQUEST, GET_TOKEN_STATS_SUCCESS, GET_TOKEN_STATS_ERROR
} from './constants';

export const initialState = fromJS({
  isLoadingChart: false,
  pagination: 0,
  search: null,
  tokenData: null
});


function investReducer(state = initialState, action) {
  switch (action.type) {
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
