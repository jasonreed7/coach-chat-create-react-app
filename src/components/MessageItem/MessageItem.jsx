var React = require('react');
var dateFormat = require('dateformat');

var MessageItem = React.createClass({
	render: function() {

		var urlRegExp = /(\(?(?:(?:http|https|ftp):\/\/)?(?:(?:(?:[^\W\s]|\.|-|[:]{1})+)@{1})?(?:(?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(?:\d*))?(?:[\/]?[^\s\?]*[\/]{1})*(?:\/?(?:[^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?(?:[\.]{1}[^\s\?\#]*)?)?(?:\?{1}(?:[^\s\n\#\[\]]*))?(?:[\#][^\s\n]*)?\)?)/gi;

		return (
			<div className="message-container">
				{ this.props.dateChange ? (
					<div className="date-change">{ dateFormat(this.props.time, 'mmmm d, yyyy') }</div>
				) : '' }
				<div className="message">
					<div className="poster">{(this.props.firstName && this.props.lastName) ? this.props.firstName + ' ' + this.props.lastName : this.props.poster}</div>
					<div className="time">{ dateFormat(this.props.time, 'h:MM TT') }</div>
					<div className="content">{this.props.children}</div>
				</div>
			</div>
		);
	}
});

module.exports = MessageItem;