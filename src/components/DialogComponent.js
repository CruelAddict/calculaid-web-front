import React from 'react'
import DisplayedMessages from "../containers/DisplayedMessages";

export default class DialogComponent extends React.Component {
    render() {
        return <div className={'dialog-container'}>
            <form onSubmit={this.props.sendSpeech} id={'dialog'}>
                <div className={'dialog-content'}>
                    <DisplayedMessages
                        recognizer={this.props.recognizer}
                        recognizing={this.props.recognizing}
                    />
                    <input
                        type="text"
                        value={this.props.state.userSpeech}
                        onChange={this.props.updateInputValue}
                    />
                </div>

            </form>
        </div>
    }
}
