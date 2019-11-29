import React from 'react';
import {connect} from 'react-redux'
import Actions from "../modules/actions";
import DisplayedMessages from '../containers/DisplayedMessages'
import ProductOption from '../containers/ProductOption'
import messageTypes from '../modules/messageTypes'
import DialogComponent from "../components/DialogComponent";

const mapStateToProps = state => ({
    responseMessages: state.responseMessages,
    displayedMessages: state.displayedMessages,
    recognizing: state.recognizing
});

const mapDispatchToProps = dispatch => ({
    addResponse: response => dispatch(Actions.addResponse(response)),
    chooseItem: (parsedItemIndex, id) => dispatch(Actions.chooseItem(parsedItemIndex, id)),
    addDisplayedMessage: messageObject => dispatch(Actions.addDisplayedMessage(messageObject)),
    addQueuedMessage: messageObject => dispatch(Actions.addQueuedMessage(messageObject)),
    releaseQueuedItem: () => dispatch(Actions.releaseQueuedItem()),
    addUserResponse: response => dispatch(Actions.addUserResponse(response)),
    handleLastDisplayedMessage: () => dispatch(Actions.handleLastDisplayedMessage()),
    enableVoiceRecognition: ()=> dispatch(Actions.enableVoiceRecognition()),
    disableVoiceRecognition: () => dispatch(Actions.disableVoiceRecognition())

});

function postData(url = '', data = {}) {
    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data), // тип данных в body должен соответвовать значению заголовка "Content-Type"
    })
        .then(response => response.json()); // парсит JSON ответ в Javascript объект
}


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
        this.shouldStopRecognition = false;
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
                this.props.enableVoiceRecognition();
            };
            this.recognizer.onend = () => {
                this.props.disableVoiceRecognition()
                let speech = this.state.userSpeech;
                this.setState({
                    userSpeech: ''
                });
                speech !== '' && this.props.addUserResponse(speech);
                this.shouldStopRecognition = speech === '';
            };
            this.recognizer.onerror = () => {
                this.shouldStopRecognition = true;
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
        if(!this.props.recognizing && !this.shouldStopRecognition) {
            console.log('starting');
            this.props.enableVoiceRecognition().then(() => {
                this.recognizer.start();
            });
        }
        if(this.shouldStopRecognition) {
            this.shouldStopRecognition = false;
        }
    }

    updateInputValue(evt) {
        this.setState({
            userSpeech: evt.target.value
        })
    }

    componentDidUpdate() {
        if (this.props.displayedMessages.items[this.props.displayedMessages.items.length - 1].type === messageTypes.mealInfo) {
            this.shouldStopRecognition = true;
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
        postData('http://172.20.10.3:3001/api/products', {speech: userInput})
            .then(data => this.addResponse({items: data.data})) // JSON-строка полученная после вызова `response.json()`
            .catch(error => console.error(error));
        // setTimeout(userInput => {
        //     this.addResponse(fakeResponse)
        // }, 500)
    }

    render() {
        // console.log(this.props.displayedMessages.items);
        return <DialogComponent
            state={this.state}
            sendSpeech={this.sendSpeech}
            updateInputValue={this.updateInputValue}
            recognizer={this.recognizer}
        />
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dialog)
