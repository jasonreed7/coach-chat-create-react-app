var React = require('react');
var jQuery = require('jquery');
var MessageItem = require('../MessageItem/MessageItem');

function scrollToBottom() {
      var $messageList = jQuery('.message-list');
      $messageList.scrollTop($messageList[0].scrollHeight);
}

var MessageList = React.createClass({
	componentDidUpdate: function(prevProps, prevState) {
		// TODO: Resolve when to scroll down
		// If new messages, scroll to bottom
		/* 
		if(prevProps.messages.length != this.props.messages.length) {
			scrollToBottom();
		}
		*/
		// for now scroll down whenever component updates, since there will always be new messages
		scrollToBottom();
	},

	render: function() {
		var messages = this.props.messages.map(function(message) {
				return (
					<MessageItem content={message.Content} poster={message.Poster} time={message.PostTime} dateChange={message.DateChange} key={message.id} />
				);
			});

		return (
			<div className="message-list">{messages}</div>
		);
	}
});

module.exports = MessageList;