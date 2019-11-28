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

    render() {
        console.log(this.props.message.mealInfo.items.map(item => (item.products[0])));
        // console.log(this.props.message.mealInfo);
        return <span>{`Вы съели ${this.props.message.mealInfo.items.map(item => (item.products[0].name)).join(' и ')}`}</span>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MealInfo)
