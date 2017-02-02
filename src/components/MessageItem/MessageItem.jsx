var React = require('react');

var MessageItem = React.createClass({
	render: function() {
		return (
			<div className="message-container">
				{ this.props.dateChange ? (
					<div className="date-change">{ this.props.time.toLocaleDateString() }</div>
				) : '' }
				<div className="message">
					<div className="poster">{this.props.poster}</div>
					<div className="time">{this.props.time.toLocaleTimeString()}</div>
					<div className="content">{this.props.content}</div>
				</div>
			</div>
		);
	}
});

module.exports = MessageItem;