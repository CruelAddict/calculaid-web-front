import responseReducer from './responseReducer'
import displayedMessagesReducer from './displayedMessagesReducer'
import failedItemsReducer from './failedItemsReducer'
import recognitionStatusReducer from './recognitionStatusReducer'
import {combineReducers} from 'redux'

export default combineReducers({
    responseMessages: responseReducer,
    displayedMessages: displayedMessagesReducer,
    failedItemsCount: failedItemsReducer,
    voiceRecognition: recognitionStatusReducer
})
