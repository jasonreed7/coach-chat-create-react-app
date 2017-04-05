var React = require('react');

var InitialMessage = function(props) {
	if(props.spinner) {
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
	else {
		return (
			<div className="message-list loading">
				<div className="v-center-container">
					<div className="h-center-container">
						<div className="initial-message">{props.message}</div>
					</div>
				</div>
			</div>
		);
	}
};

module.exports = InitialMessage;