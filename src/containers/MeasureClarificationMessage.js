import React from 'react'
import Actions from "../modules/actions";
import connect from "react-redux/es/connect/connect";
import MeasureOption from "./MeasureOption";

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


class MeasureClarificationMessage extends React.Component {

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
        // console.log(this.props.failedItemsCount);
        if((this.props.failedItemsCount === this.props.message.rawResponse.products.length) && this.props.main) {
            this.props.dropFailedCount();
            this.props.replayMessage();
        }
    }

    toChunks(array, size) {
        let results = [];
        while (array.length) {
            results.push(array.splice(0, size));
        }
        return results;
    };

    render() {
        let mainClass = this.props.main ? ' main' : '';
        let amountOptionsSets = this.toChunks([ ... this.props.responseMessages.items.filter(
            responseMessage => responseMessage['actual']
        )[0].items[this.props.message.vagueProductIndex].product.measures], 6);
        return <div className={mainClass}>
            <span>Так а сколько?</span>
            <div className={'options-container'} >
                {amountOptionsSets.map( (amountOptionSet, index) => (
                        amountOptionSet.map(
                            measure => (
                                <div>
                                    <MeasureOption
                                        text={measure.name}
                                        key={measure.id}
                                        measureId={measure.id}
                                        vagueProductIndex={this.props.message.vagueProductIndex}
                                        grams={measure.grams}
                                        main={this.props.main}
                                    />
                                </div>
                            )
                        )
                    )
                )}
            </div>

        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MeasureClarificationMessage)
