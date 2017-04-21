var React = require('react');
var jQuery = require('jquery');
var MessageItem = require('../MessageItem/MessageItem');
var MessageText = require('../MessageText/MessageText');
var AttachmentItem = require('../AttachmentItem/AttachmentItem');
var Attachment = require('../../models/Attachment');
var TextPost = require('../../models/TextPost');
var InitialMessage = require('../InitialMessage/InitialMessage');

function scrollToBottom() {
      var $messageList = jQuery('.message-list');
      $messageList.scrollTop($messageList[0].scrollHeight);
}


var MessageList = React.createClass({
	componentDidUpdate: function(prevProps, prevState) {
		var currentLength = this.props.messages.filter(function(message) {
				return message.isUploaded;
			}).length;

		var prevLength = this.props.messages.filter(function(message) {
				return message.isUploaded;
			}).length;

		if(currentLength > prevLength) {
			scrollToBottom();
		}	
	},

	render: function() {
		if(!this.props.validUser) {
			return <InitialMessage message="Please use the personal link that was emailed to you to access your account" />;
		}
		else if(!this.props.hasInitialMessages) {
			return (
					<InitialMessage spinner={true} />
			);
		}
		else if(this.props.messages.length === 0) {
			return (
					<InitialMessage message="No messages yet" />
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
					<AttachmentItem attachment={message} scrollToBottom={scrollToBottom} />
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