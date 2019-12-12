import Actions from './actions'

export default (state = false, action) => {
    // console.log('dispatching');
    // console.log(action.type);
    switch (action.type) {
        case Actions.Types.VOICE_RECOGNITION_ENABLED:
            return {
                ...state,
                recognizing: true
            };

        case Actions.Types.VOICE_RECOGNITION_DISABLED:
            return {
                ...state,
                recognizing: false
            };

        case Actions.Types.RECOGNITION_FORCE_START:
            return {
                recognizing: true,
                forceStopped: false
            };

        case Actions.Types.RECOGNITION_FORCE_STOP:
            return {
                recognizing: false,
                forceStopped: true
            };

        default:
            return state;
    }
}
