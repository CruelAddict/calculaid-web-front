import React from 'react'
import DisplayedMessages from "../containers/DisplayedMessages";
import Actions from "../modules/actions";
import connect from "react-redux/es/connect/connect";


const mapStateToProps = state => ({
    displayedMessages: state.displayedMessages,
    recognition: state.voiceRecognition
});


const mapDispatchToProps = dispatch => ({
    addResponse: response => dispatch(Actions.addResponse(response)),
    chooseItem: (parsedItemIndex, id) => dispatch(Actions.chooseItem(parsedItemIndex, id)),
    addDisplayedMessage: messageObject => dispatch(Actions.addDisplayedMessage(messageObject)),
    addQueuedMessage: messageObject => dispatch(Actions.addQueuedMessage(messageObject)),
    releaseQueuedItem: () => dispatch(Actions.releaseQueuedItem()),
    enableVoiceRecognition: ()=> dispatch(Actions.enableVoiceRecognition()),
    disableVoiceRecognition: () => dispatch(Actions.disableVoiceRecognition()),
    recognitionForceStart: () => dispatch(Actions.recognitionForceStart()),
    recognitionForceStop: () => dispatch(Actions.recognitionForceStop())
});

class DialogComponent extends React.Component {

    render() {
        // console.log(this.props.recognition.recognizing);
        // console.log('store:');
        // console.log(this.props.recognition);
        let buttonClass = this.props.recognition.recognizing ? 'active' : 'disabled';
        return <div className={'dialog-container'}>
            <form onSubmit={this.props.sendSpeech} id={'dialog'}>
                <div className={'dialog-content'}>
                    <DisplayedMessages
                        recognizer={this.props.recognizer}
                    />
                    <input
                        type="text"
                        value={this.props.state.userSpeech}
                        onChange={this.props.updateInputValue}
                    />
                </div>

            </form>
            <button
                className={'speech-recognition-button ' + buttonClass}
                onClick={this.props.recognition.recognizing ? () => {
                    this.props.recognitionForceStop().then(() => {
                        // console.log('aborting');
                        this.props.recognizer.abort();
                    });
                }
                    : () => {
                    this.props.recognitionForceStart().then(() => {
                        // console.log('starting');
                        this.props.recognizer.start();
                    });
                    }}
            >⬤</button>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogComponent)
