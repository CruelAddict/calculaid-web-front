import React from 'react';
import {connect} from 'react-redux'
import Actions from "../modules/actions";
import ProductClarificationMessage from '../containers/ProductClarificationMessage'
import SpanMessage from '../containers/SpanMessage'
import MealInfo from '../containers/MealInfo'
import messageTypes from '../modules/messageTypes'
import UserInput from './UserInput'


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


class DisplayedMessages extends React.Component {

    constructor() {
        super();
    }

    componentDidUpdate() {
        window.document.getElementById('dialog-messages').scrollIntoView(false);
        // console.log(this.props.recognizing);
        // !this.props.recognizing && this.props.recognizer.start();
    }

    render() {
        // console.log('displayed: ');
        // console.log(this.props.displayedMessages.items);
        // console.log('queued: ');
        // console.log(this.props.displayedMessages.queuedItems);
        let messages = this.props.displayedMessages.items.map((message, index, array) => {
            let main = (index === array.length - 1) || ((index === array.length - 2) && array[index+1].type === messageTypes.userInput);
            switch (message.type) {
                case messageTypes.productClarification:
                    return <ProductClarificationMessage message={message} main={main} key={index}/>;
                case messageTypes.simpleMessage:
                    return <SpanMessage message={message} main={main} key={index}/>;
                case messageTypes.mealInfo:
                    return <MealInfo message={message} main={main} key={index}/>;
                case messageTypes.userInput:
                    return <UserInput message={message} key={index}/>;
                default:
                    return null;
            }
            }
        );
        return <div className={'dialog-messages-wrapper'}>
            <div id={'dialog-messages'}>
                {messages}
            </div>
        </div>
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DisplayedMessages)
