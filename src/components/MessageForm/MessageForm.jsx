var React = require('react');
var TextArea = require('react-textarea-autosize').default;
var EJ = EJ;

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
		var that = this;
		var userInput = this.state.userInput;

		this.props.sendMessage(userInput).then(function() {
			that.setState({ userInput: '' });
		});
	},

	render: function() {
		return (
			<div className="message-form">
				<TextArea className="message-input" value={this.state.userInput} onChange={this.handleUserInput} />
				<button className="message-button" onClick={this.sendMessage}>Send Message</button>
				<EJ.RTE width="100%" minWidth="150px" isResponsive={true}></EJ.RTE>
			</div>
		);
	}
});

module.exports = MessageForm;