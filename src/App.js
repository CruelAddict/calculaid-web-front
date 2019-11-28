import React from 'react';
import {connect} from 'react-redux'
import Actions from "./modules/actions";
import DisplayedMessages from './containers/DisplayedMessages'
import ProductOption from './containers/ProductOption'
import messageTypes from './modules/messageTypes'

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
    addUserResponse: response => dispatch(Actions.addUserResponse(response)),
    handleLastDisplayedMessage: () => dispatch(Actions.handleLastDisplayedMessage())

});

const fakeResponse = {
    items: [
        {
            products: [
                {
                    name: 'tykva',
                    id: 1
                },
                {
                    name: 'kartoshka',
                    id: 2
                }
            ]
        },
        {
            products: [
                {
                    name: 'hamburger',
                    id: 3
                },
                {
                    name: 'cola',
                    id: 4
                }
            ]
        }
    ]
};

class App extends React.Component {

    constructor() {
        super();
        this.addResponse = this.addResponse.bind(this);
        this.chooseItem = this.chooseItem.bind(this);
        this.sendSpeech = this.sendSpeech.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
        this.state = {
            userSpeech: ''
        };
    }

    sendSpeech(evt) {
        evt.preventDefault();
        this.props.addUserResponse(this.state.userSpeech);
    }

    addResponse(response) {
        this.props.addResponse(response).then(() => {
            this.props.responseMessages.items[this.props.responseMessages.items.length - 1].items.map(
                (item, index) => {
                    index === 0 ?
                        !item.resolved && this.props.addDisplayedMessage(this.parseResponse(item, index))
                        :
                        !item.resolved && this.props.addQueuedMessage(this.parseResponse(item, index))
                }
            )
        })
    }

    parseResponse(rawResponse, index) {
        return {
            type: messageTypes.productClarification,
            rawResponse,
            vagueProductIndex: index,
            expectedNext: messageTypes.userProductClarification
        }
    }

    chooseItem() {
        this.props.chooseItem(0, 1);
    }

    updateInputValue(evt) {
        this.setState({
            userSpeech: evt.target.value
        })
    }

    componentDidMount() {
        this.props.addDisplayedMessage({
            type: messageTypes.simpleMessage,
            text: 'Добрый день! Как прошел ваш прием пищи?',
            expectedNext: messageTypes.userMealInfo,
            handled: false
        })
    }

    componentDidUpdate() {
        if(this.props.displayedMessages.items.length !== 0) {
            if ((this.props.displayedMessages.items[this.props.displayedMessages.items.length - 1].type === messageTypes.userInput)) {
                if(this.props.displayedMessages.items[this.props.displayedMessages.items.length - 2].expectedNext === messageTypes.userMealInfo) {
                    if(!this.props.displayedMessages.items[this.props.displayedMessages.items.length - 1].handled) {
                        this.props.handleLastDisplayedMessage().then(() => {
                            this.parseMealInfo(this.props.displayedMessages.items[this.props.displayedMessages.items.length - 1].text);
                        })
                    }
                }
            }
        }
    }

    parseMealInfo(userInput) {
        // console.log(this.props.displayedMessages.items);
        // console.log('calling api!');
        setTimeout(userInput => {
            this.addResponse(fakeResponse)
        }, 500)
    }

    render() {
        // console.log(this.props.displayedMessages.items);
        return <form onSubmit={this.sendSpeech}>
            <button>send text</button>
            <input type="text" value={this.state.userSpeech} onChange={this.updateInputValue} />
            <DisplayedMessages/>
        </form>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
