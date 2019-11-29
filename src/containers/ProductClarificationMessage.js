import React from 'react'
import Actions from "../modules/actions";
import connect from "react-redux/es/connect/connect";
import ProductOption from "./ProductOption";

const mapStateToProps = state => ({
    responseMessages: state.responseMessages,
    displayedMessages: state.displayedMessages,
    failedItemsCount: state.failedItemsCount
});

const mapDispatchToProps = dispatch => ({
    addResponse: response => dispatch(Actions.addResponse(response)),
    chooseItem: (parsedItemIndex, id) => dispatch(Actions.chooseItem(parsedItemIndex, id)),
    addDisplayedMessage: messageObject => dispatch(Actions.addDisplayedMessage(messageObject)),
    addQueuedMessage: messageObject => dispatch(Actions.addQueuedMessage(messageObject)),
    releaseQueuedItem: () => dispatch(Actions.releaseQueuedItem()),
    displayMealInfo: mealInfo => dispatch(Actions.displayMealInfo(mealInfo)),
    dropFailedCount: () => dispatch(Actions.dropFailedCount()),
    replayMessage: () => dispatch(Actions.replayMessage())
});


class ProductClarificationMessage extends React.Component {

    constructor() {
        super();
        this.chooseItem = this.chooseItem.bind(this);
    }

    chooseItem () {
        this.props.chooseItem(this.props.message.vagueProductIndex, 1).then(
            () => {
                this.props.displayedMessages.queuedItems.length !== 0 ?
                    this.props.releaseQueuedItem()
                    :
                    this.props.displayMealInfo(this.props.responseMessages.items.filter(
                        responseMessage => responseMessage['actual'])[0])
            }
        );
    }

    componentDidUpdate () {
        console.log(this.props.failedItemsCount);
        if((this.props.failedItemsCount === this.props.message.rawResponse.products.length) && this.props.main) {
            this.props.dropFailedCount();
            this.props.replayMessage();
        }
    }

    render() {
        let mainClass = this.props.main ? ' main' : '';
        return <div className={mainClass}>
            <span>Нам необходимо кое-что уточнить. Что конкретно вы съели?</span>
            <div className={'options-container'} >
                {this.props.message.rawResponse.products.map(product => (
                    <ProductOption
                        text={product.name}
                        key={product.id}
                        productId={product.id}
                        vagueProductIndex={this.props.message.vagueProductIndex}
                        main={this.props.main}
                    />))}
            </div>

        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductClarificationMessage)
