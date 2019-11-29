import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducer from './rootReducer';


const initialState = {
    responseMessages: {
        items: []
    },
    displayedMessages: {
        items: [],
        queuedItems: []
    },
    failedItemsCount: 0
};

const configureStore = () => {
    return createStore(
        reducer,
        initialState,
        applyMiddleware(thunk)
    );
};

const store = configureStore();

export default store;
