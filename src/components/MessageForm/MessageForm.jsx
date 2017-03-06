var React = require('react');
var TextArea = require('react-textarea-autosize').default;

var MessageForm = React.createClass({
	getInitialState: function() {
		return { userInput: '' };
	},

	handleUserInput: function(e) {
		this.setState({
			userInput: e.target.value
		});
	},

	sendMessage: function() {
		var userInput = this.state.userInput;


		this.setState({ userInput: '' });

		if(userInput.trim() != '') {
			this.props.sendMessage(userInput);
			this.textArea.focus();
		}
	},

	hasUserInput: function() {
		return this.state.userInput != '';
	},

	render: function() {

		var fileInput

		if(!this.hasUserInput()) {
			fileInput = [(
					<input type="file" id="file-input" className="file-input" onChange={this.props.sendFile} />
				),
				(
					<label htmlFor="file-input" className="file-input-label">
						<i className="fa fa-paperclip" aria-hidden="true"></i>
					</label>
				)];
		}

		return (
			<div className="message-form">
				<TextArea className={ "message-input " + ( this.hasUserInput() ? "has-input" : "" ) } value={this.state.userInput} onChange={this.handleUserInput} onHeightChange={this.props.resizeMessageList}
				ref = { (textArea) => { this.textArea = textArea; } }/>
				{fileInput}
				<button className="message-button" onClick={this.sendMessage}>Send Message</button>
			</div>
		);
	}
});

module.exports = MessageForm;