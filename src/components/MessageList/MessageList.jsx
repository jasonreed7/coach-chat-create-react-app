var React = require('react');
var jQuery = require('jquery');
var MessageItem = require('../MessageItem/MessageItem');
var MessageText = require('../MessageText/MessageText');
var AttachmentItem = require('../AttachmentItem/AttachmentItem');
var Attachment = require('../../models/Attachment');
var TextPost = require('../../models/TextPost');

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
		var messages = [];
		this.props.messages.forEach(function(message) {

			var child;

			// Set child depending on if message is text or attachment
			if(message.constructor === TextPost) {
				child = (
					<MessageText message={message} />
				)
			}
			else if(message.constructor === Attachment) {
				child = (
					<AttachmentItem attachment={message} />
				)
			}

			// Add MessageItem for message
			messages.push((
				<MessageItem poster={message.poster} time={message.postTime} dateChange={message.dateChange} firstName={message.firstName} lastName={message.lastName}  key={message.id} >
					{child}
				</MessageItem>
			));

		});

		return (
			<div className="message-list">{messages}</div>
		);

	}

});

module.exports = MessageList;