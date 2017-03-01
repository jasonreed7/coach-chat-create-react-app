var React = require('react');
var dateFormat = require('dateformat');

var MessageItem = React.createClass({
	render: function() {

		/* 
		Url regex from http://someweblog.com/url-regular-expression-javascript-link-shortener/

		Original version:

		var urlRegex = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi;
		*/

		// Split message into links and regular text
		var urlRegExp = /(\(?(?:(?:http|https|ftp):\/\/)?(?:(?:(?:[^\W\s]|\.|-|[:]{1})+)@{1})?(?:(?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(?:\d*))?(?:[\/]?[^\s\?]*[\/]{1})*(?:\/?(?:[^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?(?:[\.]{1}[^\s\?\#]*)?)?(?:\?{1}(?:[^\s\n\#\[\]]*))?(?:[\#][^\s\n]*)?\)?)/gi;
		
		var protocolRegExp = /(?:http|https|ftp):\/\//i;

		var messageParts = this.props.content.split(urlRegExp);

		var messageResultParts = [];

		messageParts.forEach(function(part, index) {
			// If message part is a link
			if(urlRegExp.test(part) && !part.includes('@')) {
				var link = part;

				// If link does not contain http:// or https:// or ftp://, put http:// at the beginning
				if(!protocolRegExp.test(part)) {
					link = 'http://' + part;
				}
				messageResultParts[index] = (
					<a href={link} target="_blank">{part}</a>
				)
			}
			else {
				messageResultParts[index] = (
					<span>{part}</span>
				)
			}
		});

		return (
			<div className="message-container">
				{ this.props.dateChange ? (
					<div className="date-change">{ dateFormat(this.props.time, 'mmmm d, yyyy') }</div>
				) : '' }
				<div className="message">
					<div className="poster">{(this.props.firstName && this.props.lastName) ? this.props.firstName + ' ' + this.props.lastName : this.props.poster}</div>
					<div className="time">{ dateFormat(this.props.time, 'h:MM TT') }</div>
					<div className="content">{messageResultParts}</div>
				</div>
			</div>
		);
	}
});

module.exports = MessageItem;