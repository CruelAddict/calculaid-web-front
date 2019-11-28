import responseReducer from './responseReducer'
import displayedMessagesReducer from './displayedMessagesReducer'
import {combineReducers} from 'redux'

export default combineReducers({
    responseMessages: responseReducer,
    displayedMessages: displayedMessagesReducer
})
