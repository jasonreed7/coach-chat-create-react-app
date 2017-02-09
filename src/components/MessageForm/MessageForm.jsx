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

	render: function() {
		return (
			<div className="message-form">
				<TextArea className="message-input" value={this.state.userInput} onChange={this.handleUserInput} onHeightChange={this.props.resizeMessageList}
				ref = { (textArea) => { this.textArea = textArea; } }/>
				<button className="message-button" onClick={this.sendMessage}>Send Message</button>
			</div>
		);
	}
});

module.exports = MessageForm;