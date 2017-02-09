var React = require('react');
var dateFormat = require('dateformat');

var MessageItem = React.createClass({
	render: function() {
		return (
			<div className="message-container">
				{ this.props.dateChange ? (
					<div className="date-change">{ dateFormat(this.props.time, 'mmmm d, yyyy') }</div>
				) : '' }
				<div className="message">
					<div className="poster">{this.props.poster}</div>
					<div className="time">{ dateFormat(this.props.time, 'h:mm TT') }</div>
					<div className="content">{this.props.content}</div>
				</div>
			</div>
		);
	}
});

module.exports = MessageItem;