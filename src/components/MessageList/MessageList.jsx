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
		if(!this.props.hasInitialMessages) {
			return (
				<div className="message-list loading">
					<div className="v-center-container">
						<div className="h-center-container">
							<img className="spinner" src="http://chooseyourcoach.com/pictures/waitingpopup.gif" />
						</div>
					</div>
				</div>
			);
		}
		else if(this.props.messages.length === 0) {
			return (
				<div className="message-list loading">
					<div className="v-center-container">
						<div className="h-center-container">
							<div className="no-messages-text">No messages yet</div>
						</div>
					</div>
				</div>
			);
		}

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