const Types = {
    ADD_RESPONSE: "ADD_RESPONSE",
    CHOOSE_ITEM: "CHOOSE_ITEM",
    ADD_DISPLAYED_MESSAGE: "ADD_DISPLAYED_MESSAGE",
    ADD_QUEUED_MESSAGE: "ADD_QUEUED_MESSAGE",
    RELEASE_QUEUED_MESSAGE: "RELEASE_QUEUED_MESSAGE",
    DISPLAY_MEAL_INFO: "DISPLAY_MEAL_INFO",
    ADD_USER_RESPONSE: "ADD_USER_RESPONSE",
    HANDLE_LAST_DISPLAYED_MESSAGE: "HANDLE_LAST_DISPLAYED_MESSAGE",
    REPORT_FAILURE: "REPORT_FAILURE",
    DROP_FAILED_COUNT: "DROP_FAILED_COUNT",
    REPLAY_MESSAGE: "REPLAY_MESSAGE"
};

const addResponse = response => dispatch => {
    dispatch({
        type: Types.ADD_RESPONSE,
        payload: response
    });
    return Promise.resolve()
};

const chooseItem = (parsedProductIndex, chosenProductId) => dispatch => {
    dispatch({
        type: Types.CHOOSE_ITEM,
        payload: {
            parsedProductIndex,
            chosenProductId
        }
    });
    return Promise.resolve()
};

const addDisplayedMessage = messageObject => dispatch => {
    dispatch({
        type: Types.ADD_DISPLAYED_MESSAGE,
        payload: messageObject
    });
    return Promise.resolve()
};

const addQueuedMessage = messageObject => dispatch => {
    dispatch({
        type: Types.ADD_QUEUED_MESSAGE,
        payload: messageObject
    });
    return Promise.resolve()
};

const releaseQueuedItem = () => dispatch => {
    dispatch({
        type: Types.RELEASE_QUEUED_MESSAGE
    })
};

const displayMealInfo = mealInfo => dispatch => {
    dispatch({
        type: Types.DISPLAY_MEAL_INFO,
        payload: mealInfo
    })
};

const addUserResponse = response => dispatch => {
    dispatch({
        type: Types.ADD_USER_RESPONSE,
        payload: response
    });
    return Promise.resolve()
};

const handleLastDisplayedMessage = () => dispatch => {
    dispatch({
        type: Types.HANDLE_LAST_DISPLAYED_MESSAGE
    });
    return Promise.resolve()
};

const reportMatchFailure = () => dispatch => {
    dispatch({
        type: Types.REPORT_FAILURE
    })
};

const dropFailedCount = () => dispatch => {
    dispatch({
        type: Types.DROP_FAILED_COUNT
    })
};

const replayMessage = () => dispatch => {
    dispatch({
        type: Types.REPLAY_MESSAGE
    })
};

export default {
    addResponse,
    chooseItem,
    addDisplayedMessage,
    addQueuedMessage,
    releaseQueuedItem,
    displayMealInfo,
    addUserResponse,
    handleLastDisplayedMessage,
    reportMatchFailure,
    dropFailedCount,
    replayMessage,
    Types
}
