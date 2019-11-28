import React from 'react'
import Actions from "../modules/actions";
import connect from "react-redux/es/connect/connect";
import ProductOption from "./ProductOption";

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
    displayMealInfo: mealInfo => dispatch(Actions.displayMealInfo(mealInfo))
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

    render() {
        return <div>
            <span>Нам необходимо кое-что уточнить. Что конкретно вы съели?</span>
            {this.props.message.rawResponse.products.map(product => (
                <ProductOption
                    text={product.name}
                    key={product.id}
                    productId={product.id}
                    vagueProductIndex={this.props.message.vagueProductIndex}
                    main={this.props.main}
                />))}
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductClarificationMessage)
