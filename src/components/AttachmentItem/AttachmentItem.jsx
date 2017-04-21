var React = require('react');

var AttachmentItem = React.createClass({

	getInitialState: function() {
		return {
			imageLoaded: false,
			imageError: false,
			imageTries: 0
		};
	},

	scroll: function(e) {
		if(!this.state.imageLoaded) {
			this.props.scrollToBottom();
			this.setState({ imageLoaded: true });
		}
	},

	resolveError: function() {
		this.setState({ imageError: false })
	},

	imageError: function() {
		this.setState({ 
			imageError: true,
			imageTries: this.state.imageTries + 1 
		});
	},

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
				<div>
					<img className="waiting-spinner" src="http://chooseyourcoach.com/pictures/waitingpopup.gif" />
					File uploading: {attachment.name} 
				</div>
			);
		}

		if(attachment.isWebImage()) {
			// First attempt to load image
			if(!this.state.imageError || !attachment.isUploaded  || (this.state.imageTries > 2 && this.state.imageError)) {
				return (
					<div>
						<div>
							{attachmentStatus}
						</div>
						<div>
							<img className="image-attachment" src={attachment.isUploaded ? attachment.uri : attachment.dataURL} 
								onLoad={this.scroll} 
								onError={this.imageError}
							/>
						</div>
					</div>
				);
			}
			/* 
			Try again to load image (if it runs into conditional headers problem).
			Will try 3 times. 
			*/
			else {
				var timeStamp = new Date().getTime();

				return (
					<div>
						<div>
							{attachmentStatus}
						</div>
						<div>
							<img className="image-attachment" 
								src={attachment.uri + '&timeStamp=' + timeStamp} 
								onLoad={this.resolveError}
								onError={this.imageError}
							/>
						</div>
					</div>
				);

			}
		}
		else {
			return (
				<div>{attachmentStatus}</div>
			);
		}
		
	}
});

module.exports = AttachmentItem;