import React from 'react';
import {connect} from 'react-redux'
import Actions from "../modules/actions";
import DisplayedMessages from '../containers/DisplayedMessages'
import ProductOption from '../containers/ProductOption'
import messageTypes from '../modules/messageTypes'
import DialogComponent from "../components/DialogComponent";

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
                    name: 'тыква',
                    id: 1
                },
                {
                    name: 'картошка',
                    id: 2
                }
            ]
        },
        {
            products: [
                {
                    name: 'гамбургер',
                    id: 3
                },
                {
                    name: 'кола',
                    id: 4
                }
            ]
        }
    ]
};

class Dialog extends React.Component {

    constructor() {
        super();
        this.addResponse = this.addResponse.bind(this);
        this.sendSpeech = this.sendSpeech.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
        this.startRecognition = this.startRecognition.bind(this);
        this.state = {
            userSpeech: ''
        };
        this.recognizer = new window.webkitSpeechRecognition();
        this.recognizer.interimResults = true;
        this.recognizer.lang = 'ru-Ru';
        this.recognizing = false;
        this.shouldStoRecognition = false;
    }

    componentDidMount() {
        this.props.addDisplayedMessage({
            type: messageTypes.simpleMessage,
            text: 'Добрый день! Как прошел ваш прием пищи?',
            expectedNext: messageTypes.userMealInfo,
            handled: false
        }).then(() => {
            this.recognizer.onresult = event => {
                let result = event.results[event.resultIndex];
                if (result.isFinal) {
                    this.setState({
                        userSpeech: result[0].transcript
                    });

                } else {
                    this.setState({
                        userSpeech: result[0].transcript
                    });
                }
            };
            this.recognizer.onstart = () => {
                this.recognizing = true;
            };
            this.recognizer.onend = () => {
                this.recognizing = false;
                let speech = this.state.userSpeech;
                this.setState({
                    userSpeech: ''
                });
                speech !== '' && this.props.addUserResponse(speech);
                this.shouldStoRecognition = speech === '';
            };
            this.recognizer.onerror = () => {
                console.log('smth went wrong')
            }
        });

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

    startRecognition() {
        if(!this.recognizing && !this.shouldStoRecognition) {
            console.log('starting');
            this.recognizing = true;
            this.recognizer.start();
        }
        if(this.shouldStoRecognition) {
            this.shouldStoRecognition = false;
        }
    }

    updateInputValue(evt) {
        this.setState({
            userSpeech: evt.target.value
        })
    }

    componentDidUpdate() {
        if (this.props.displayedMessages.items[this.props.displayedMessages.items.length - 1].type === messageTypes.mealInfo) {
            this.shouldStoRecognition = true;
        }

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
        this.startRecognition()
    }

    parseMealInfo(userInput) {
        this.setState({
            userSpeech: ''
        });
        // console.log(this.props.displayedMessages.items);
        // console.log('calling api!');
        setTimeout(userInput => {
            this.addResponse(fakeResponse)
        }, 500)
    }

    render() {
        // console.log(this.props.displayedMessages.items);
        return <DialogComponent
            state={this.state}
            sendSpeech={this.sendSpeech}
            updateInputValue={this.updateInputValue}
            recognizer={this.recognizer}
            recognizing={this.recognizing}
        />
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dialog)
