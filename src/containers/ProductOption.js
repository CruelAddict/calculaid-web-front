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
    handleLastDisplayedMessage: () => dispatch(Actions.handleLastDisplayedMessage())
});


class ProductOption extends React.Component {

    constructor() {
        super();
        this.chooseItem = this.chooseItem.bind(this);
    }

    chooseItem() {
        console.log(this.props);
        this.props.chooseItem(this.props.vagueProductIndex, this.props.productId).then(
            () => {
                this.props.displayedMessages.queuedItems.length !== 0 ?
                    this.props.releaseQueuedItem()
                    :
                    this.props.displayMealInfo(this.props.responseMessages.items.filter(
                        responseMessage => responseMessage['actual'])[0])
            }
        );
    }

    componentDidUpdate() {
        if ((this.props.displayedMessages.items[this.props.displayedMessages.items.length - 1].type === messageTypes.userInput) && this.props.main) {
            if (this.props.displayedMessages.items[this.props.displayedMessages.items.length - 2].expectedNext === messageTypes.userProductClarification) {
                if (!this.props.displayedMessages.items[this.props.displayedMessages.items.length - 1].handled) {
                    if (this.props.displayedMessages.items[this.props.displayedMessages.items.length - 1].text === this.props.text) {
                        this.props.handleLastDisplayedMessage().then(() => {
                            console.log(this.props.displayedMessages.items);
                            this.chooseItem();
                        })
                    }
                }
            }
        }
    }

    render() {
        return <span style={{display: 'block'}} onClick={this.chooseItem}>{this.props.text}</span>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductOption)
