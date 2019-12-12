import React from 'react';
import {connect} from 'react-redux'
import Actions from "../modules/actions";
import messageTypes from '../modules/messageTypes'
import DialogComponent from "../components/DialogComponent";

const mapStateToProps = state => ({
    responseMessages: state.responseMessages,
    displayedMessages: state.displayedMessages,
    recognition: state.voiceRecognition
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
    disableVoiceRecognition: () => dispatch(Actions.disableVoiceRecognition()),
    recognitionForceStart: () => dispatch(Actions.recognitionForceStart()),
    recognitionForceStop: () => dispatch(Actions.recognitionForceStop())

});

function postData(url = '', data = {}) {
    return fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            // 'Content-Type': 'application/json',
            // 'Content-Type': 'text/plain'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        // body: JSON.stringify(data),
        body: data
    })
        .then(response => response.json());
}

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
                // console.log('starting vr');
                this.props.enableVoiceRecognition();
            };
            this.recognizer.onend = () => {
                this.props.disableVoiceRecognition();
                let speech = this.state.userSpeech;
                this.setState({
                    userSpeech: ''
                });
                speech !== '' && this.props.addUserResponse(speech);
                speech === '' && !this.props.recognition.forceStopped && this.props.recognitionForceStop().then(this.recognizer.abort)
            };
            this.recognizer.onerror = () => {
                !this.props.recognition.forceStopped && this.props.recognitionForceStop().then(this.recognizer.abort)
            }
        });

    }

    sendSpeech(evt) {
        evt.preventDefault();
        this.props.addUserResponse(this.state.userSpeech);
    }

    addResponse(response) {
        // console.log(response);
        this.props.addResponse(response).then(() => {
            response.items.map(item => (item.products.length === 0 ? 'zero' : 'non-zero')).includes('non-zero') ?  // TODO: replace with if 500
                this.props.responseMessages.items[this.props.responseMessages.items.length - 1].items.map(
                (item, index) => {
                    index === 0 ?
                        !item.resolved && this.props.addDisplayedMessage(this.parseResponse(item, index))
                        :
                        !item.resolved && this.props.addQueuedMessage(this.parseResponse(item, index))
                }
            ) :
                this.props.addDisplayedMessage({
                    type: messageTypes.simpleMessage,
                    text: 'Не очень понятно. Повторите, пожалуйста, еще раз.',
                    expectedNext: messageTypes.userMealInfo,
                    handled: false
                })
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
        if(!this.props.recognition.recognizing && !this.props.recognition.forceStopped) {
            this.props.enableVoiceRecognition().then(() => {
                // console.log('starting');
                this.recognizer.start();
            });
        }
    }

    updateInputValue(evt) {
        this.setState({
            userSpeech: evt.target.value
        })
    }

    componentDidUpdate() {
        if (this.props.displayedMessages.items[this.props.displayedMessages.items.length - 1].type === messageTypes.mealInfo) {
            this.props.recognition.recognizing && this.props.recognitionForceStop().then(
                () => {
                    this.recognizer.abort();
                }
            )
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
        // console.log(`{"speech":"${userInput}"}`);
        postData('http://194.87.101.20:3000/api/products',
            `{"speech":"${userInput}"}`
            // {speech: userInput}
            )
            .then(data => this.addResponse({items: data.data})) // JSON-строка полученная после вызова `response.json()`
            .catch(error => console.error(error));
        // setTimeout(userInput => {
        //     this.addResponse(fakeResponse)
        // }, 500)
    }

    render() {
        console.log(this.props.responseMessages);
        return <DialogComponent
            state={this.state}
            sendSpeech={this.sendSpeech}
            updateInputValue={this.updateInputValue}
            recognizer={this.recognizer}
        />
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dialog)
