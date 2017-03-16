var React = require('react');
var jQuery = require('jquery');
var MessageItem = require('../MessageItem/MessageItem');
var MessageText = require('../MessageText/MessageText');
var Attachment = require('../Attachment/Attachment');

function scrollToBottom() {
      var $messageList = jQuery('.message-list');
      $messageList.scrollTop($messageList[0].scrollHeight);
}

var imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'];

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
				// Add MessageItem for message
				messages.push((
					<MessageItem content={message.Content} poster={message.Poster} time={message.PostTime} dateChange={message.DateChange} firstName={message.FirstName} lastName={message.LastName}  key={message.id} >
						<MessageText content={message.Content} />
					</MessageItem>
				));

				// Add MessageItem for each attachment
				var attachments = message.Attachments.forEach(function(attachment, attIndex) {
					if(attachment) {

						if(imageExtensions.includes(attachment.Extension)) {
							messages.push((
								<MessageItem poster={message.Poster} time={message.PostTime} dateChange={message.DateChange} firstName={message.FirstName} lastName={message.LastName}  key={message.id + '-att-' + attIndex} >
									<img className="image-attachment" src={attachment.AURI} />
								</MessageItem>
							));
						}
						else {
							messages.push((
								<MessageItem poster={message.Poster} time={message.PostTime} dateChange={message.DateChange} firstName={message.FirstName} lastName={message.LastName}  key={message.id + '-att-' + attIndex} >
									<a className="non-image-attachment" href={attachment.AURI} >{attachment.AName}</a>
								</MessageItem>
							));
						}

					}
				});

			});

		return (
			<div className="message-list">{messages}</div>
		);

		var message = this.props.messages[0];

	/*	if(message) {
			return (
				<div className="message-list">
					<MessageItem content={message.Content} poster={message.Poster} time={message.PostTime} dateChange={message.DateChange} firstName={message.FirstName} lastName={message.LastName}  key={message.id} >
						<MessageText content={message.Content} />
					</MessageItem>
				</div>
			);	
		}
		else {
			return <div className="message-list"></div>
		}*/
	}
});

module.exports = MessageList;