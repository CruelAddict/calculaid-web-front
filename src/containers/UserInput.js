import React from 'react'
import Actions from "../modules/actions";
import connect from "react-redux/es/connect/connect";

const mapStateToProps = state => ({
    displayedMessages: state.displayedMessages
});

const mapDispatchToProps = dispatch => ({
    addResponse: response => dispatch(Actions.addResponse(response)),
    chooseItem: (parsedItemIndex, id) => dispatch(Actions.chooseItem(parsedItemIndex, id)),
    addDisplayedMessage: messageObject => dispatch(Actions.addDisplayedMessage(messageObject)),
    addQueuedMessage: messageObject => dispatch(Actions.addQueuedMessage(messageObject)),
    releaseQueuedItem: () => dispatch(Actions.releaseQueuedItem())
});


class UserInput extends React.Component {
    render() {
        return <span style={{display: 'block'}}>{this.props.message.text}</span>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInput)
