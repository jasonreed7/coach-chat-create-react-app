var React = require('react');
//var ejWeb = require('../../vendor/syncfusion/ej.web.all.min.js');
//var ejWebReact = require('../../vendor/syncfusion/ej.web.react.min.js');

var MessageItem = React.createClass({
	render: function() {
		return (
			<div className="message">
				<div className="poster">{this.props.poster}</div>
				<div className="time">{this.props.time}</div>
				<div className="content">{this.props.content}</div>
			</div>
		);
	}
});

module.exports = MessageItem;