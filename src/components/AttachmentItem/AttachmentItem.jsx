var React = require('react');

var AttachmentItem = React.createClass({

	render: function() {

		var attachment = this.props.attachment;

		var attachmentStatus;

		if(attachment.isUploaded) {
			attachmentStatus = (
				<a className="attachment-link" target="_blank" href={attachment.uri}>
					<span>File uploaded: {attachment.name}</span>
					<button className="attachment-download-button">
						<i className="fa fa-download" aria-hidden="true"></i>
					</button> 
				</a>
			);
		} 
		else {
			attachmentStatus = (
				<div><img className="waiting-spinner" src="http://chooseyourcoach.com/pictures/waitingpopup.gif" />
				File uploading: {attachment.name} 
				</div>
			);
		}

		if(attachment.isWebImage()) {
			return (
				<div>
					<div>
						{attachmentStatus}
					</div>
					<div>
						<img className="image-attachment" src={attachment.isUploaded ? attachment.uri : attachment.dataURL} />
					</div>
				</div>
			);
		}
		else {
			return (
				<div>{attachmentStatus}</div>
			);
		}
		
	}
});

module.exports = AttachmentItem;