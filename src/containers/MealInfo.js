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


class MealInfo extends React.Component {

    calculateBreadUnits(products) {
        let breadUnits = 0;
        console.log(products);
        for (let product of products) {
            breadUnits+= (1 * product.product.measure.grams) / 100 * product.product.pfc.c
        }
        return breadUnits;
    }

    render() {
        let mainClass = this.props.main ? ' main' : '';
        return <span className={mainClass}>{`Вы съели ${this.props.message.mealInfo.items.map(item => (`${item.product.name}, ${item.product.measure.name}`)).join(' и ')}.
        Это ${this.calculateBreadUnits(this.props.message.mealInfo.items)} хлебных единиц`}</span>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MealInfo)
