var React = require('react');
var MessageItem = require('../MessageItem/MessageItem');

var MessageList = React.createClass({

	render: function() {
		var messages = this.props.messages.map(function(message) {
				return (
					<MessageItem content={message.Content} poster={message.Poster} time={message.PostTime} />
				);
			});

		return (
			<div className="message-list">{messages}</div>
		);
	}
});

module.exports = MessageList;