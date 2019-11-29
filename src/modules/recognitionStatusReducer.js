import Actions from './actions'

export default (state = false, action) => {
    switch (action.type) {
        case Actions.Types.VOICE_RECOGNITION_ENABLED:
            return true;

        case Actions.Types.VOICE_RECOGNITION_DISABLED:
            return false;

        default:
            return state;
    }
}
