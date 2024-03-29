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
    addDisplayedMessage: messageObject => dispatch(Actions.addDisplayedMessage(messageObject)),
    addQueuedMessage: messageObject => dispatch(Actions.addQueuedMessage(messageObject)),
    releaseQueuedItem: () => dispatch(Actions.releaseQueuedItem()),
    displayMealInfo: mealInfo => dispatch(Actions.displayMealInfo(mealInfo)),
    handleLastDisplayedMessage: () => dispatch(Actions.handleLastDisplayedMessage()),
    reportMatchFailure: () => dispatch(Actions.reportMatchFailure())
});


class ProductOption extends React.Component {

    constructor() {
        super();
        this.chooseItem = this.chooseItem.bind(this);
    }

    chooseItem() {
        // console.log(this.props);
        this.props.chooseItem(this.props.vagueProductIndex, this.props.productId).then(
            () => {
                if (this.props.responseMessages.items.filter(             // there is something to choose between
                    responseMessage => responseMessage['actual']
                )[0].items[this.props.vagueProductIndex].product.measures.length !== 1
                // &&
                // this.props.responseMessages.items.filter(             // there is no special amount specified
                //     responseMessage => responseMessage['actual']
                // )[0].items[this.props.vagueProductIndex].products[0].measure === undefined
                ) {
                    this.props.addDisplayedMessage({
                        type: messageTypes.measureClarification,
                        expectedNext: messageTypes.userMeasureClarification,
                        rawResponse: this.props.rawResponse,
                        vagueProductIndex: this.props.vagueProductIndex,
                        handled: false
                    })
                } else if (this.props.displayedMessages.queuedItems.length !== 0) {  // more queued messages
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
        return <div className={'product-item-container ' + clickableClass}
                    onClick={this.props.main ? this.chooseItem : null}>
            <p style={{display: 'block'}}>{this.props.text}</p>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductOption)
