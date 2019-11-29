import Actions from './actions'

export default (state = 0, action) => {
    switch (action.type) {
        case Actions.Types.REPORT_FAILURE:
            return state+1;

        case Actions.Types.DROP_FAILED_COUNT:
            return 0;

        default:
            return state;
    }
}
