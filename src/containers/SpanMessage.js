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


class SpanMessage extends React.Component {
    render() {
        let mainClass = this.props.main ? ' main' : '';
        return <div className={mainClass}>
            <p style={{display: 'block'}}>{this.props.message.text}</p>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SpanMessage)
