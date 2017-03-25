var React = require('react');

var MessageText = React.createClass({

	render: function() {

		var message = this.props.message;

		// Split content into links and text and map to jsx
		var result = message.splitLinks().map(function(part) {
			if(part.isLink) {
				return (
					<a href={part.link} target="_blank">{part.text}</a>
				);
			}
			else {
				return (
					<span>{part.text}</span>
				);
			}
		});

		return (
			<div>{result}</div>
		);
	}
});

module.exports = MessageText;