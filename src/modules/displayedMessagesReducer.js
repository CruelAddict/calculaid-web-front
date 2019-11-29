import Actions from './actions'
import messageTypes from './messageTypes'


export default (state = {items: [], queuedItems: []}, action) => {
    switch (action.type) {
        case Actions.Types.ADD_DISPLAYED_MESSAGE:
            return {
                items: [
                    ...state.items,
                    action.payload
                ],
                queuedItems: [
                    ...state.queuedItems
                ]
            };

        case Actions.Types.ADD_QUEUED_MESSAGE:
            return {
                items: [
                    ...state.items
                ],
                queuedItems: [
                    ...state.queuedItems,
                    action.payload
                ]
            };

        case Actions.Types.RELEASE_QUEUED_MESSAGE:
            return  {
                items: [
                    ...state.items,
                    state.queuedItems.pop()
                ],
                queuedItems: [
                    ...state.queuedItems
                ]
            };

        case Actions.Types.DISPLAY_MEAL_INFO:
            return  {
                items: [
                    ...state.items,
                    {
                        mealInfo: action.payload,
                        type: messageTypes.mealInfo,
                        expectedNext: messageTypes.userMealInfo
                    }
                ],
                queuedItems: []
            };

        case Actions.Types.ADD_USER_RESPONSE:
            return {
                ...state,
                items: [
                    ...state.items,
                    {
                        type: messageTypes.userInput,
                        text: action.payload
                    }
                ]
            };

        case Actions.Types.HANDLE_LAST_DISPLAYED_MESSAGE:
            let lastItem = state.items.pop();
            return {
                ...state,
                items: [
                    ...state.items,
                    {
                        ...lastItem,
                        handled: true
                    }
                ]
            };

        case Actions.Types.REPLAY_MESSAGE:
            return {
                ...state,
                items: [
                    ...state.items,
                    state.items[state.items.length-2]
                ]
            };

        default:
            return state;
    }
}
