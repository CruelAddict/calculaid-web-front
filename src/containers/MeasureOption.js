import React from 'react'
import Actions from "../modules/actions";
import connect from "react-redux/es/connect/connect";
import messageTypes from '../modules/messageTypes'

const mapStateToProps = state => ({
    responseMessages: state.responseMessages,
    displayedMessages: state.displayedMessages
});

const mapDispatchToProps = dispatch => ({
    addResponse: response => dispatch(Actions.addResponse(response)),
    chooseItem: (parsedItemIndex, id) => dispatch(Actions.chooseItem(parsedItemIndex, id)),
    chooseMeasure: (parsedItemIndex, id) => dispatch(Actions.chooseMeasure(parsedItemIndex, id)),
    addDisplayedMessage: messageObject => dispatch(Actions.addDisplayedMessage(messageObject)),
    addQueuedMessage: messageObject => dispatch(Actions.addQueuedMessage(messageObject)),
    releaseQueuedItem: () => dispatch(Actions.releaseQueuedItem()),
    displayMealInfo: mealInfo => dispatch(Actions.displayMealInfo(mealInfo)),
    handleLastDisplayedMessage: () => dispatch(Actions.handleLastDisplayedMessage()),
    reportMatchFailure: () => dispatch(Actions.reportMatchFailure())
});


class MeasureOption extends React.Component {

    constructor() {
        super();
        this.chooseItem = this.chooseItem.bind(this);
    }

    chooseItem() {
        this.props.chooseMeasure(this.props.vagueProductIndex, this.props.measureId).then(
            () => {
                if (this.props.displayedMessages.queuedItems.length !== 0) {  // no more queued messages
                    console.log('releasing queue!');
                    this.props.releaseQueuedItem();
                } else {
                        this.props.displayMealInfo(this.props.responseMessages.items.filter(
                            responseMessage => responseMessage['actual'])[0])
                }
            }
        );
    }

    componentDidUpdate() {
        if ((this.props.displayedMessages.items[this.props.displayedMessages.items.length - 1].type === messageTypes.userInput)     // user has said something
            && this.props.main) {                                                                                                       // this is the last message atm
            if (this.props.displayedMessages.items[this.props.displayedMessages.items.length - 2].expectedNext === messageTypes.userProductClarification) { // we expect product clarification
                if (!this.props.displayedMessages.items[this.props.displayedMessages.items.length - 1].handled) {                       // last message is not handled
                    if (this.props.displayedMessages.items[this.props.displayedMessages.items.length - 1].text.toLowerCase() === this.props.text.toLowerCase().replace(/[^A-Za-zА-Яа-яЁё\s]/g, '')) {  // this option is the one
                        this.props.handleLastDisplayedMessage().then(() => {
                            // console.log(this.props.displayedMessages.items);
                            this.chooseItem();
                        })
                    } else this.props.reportMatchFailure()  // increases fail counter
                }
            }
        }
    }

    render() {
        let clickableClass = this.props.main ? 'clickable' : 'not-clickable';
        return <div className={'product-item-container '+clickableClass}
                    onClick={this.props.main ? this.chooseItem : null}>
            <p style={{display: 'block'}} >{this.props.text}</p>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MeasureOption)
