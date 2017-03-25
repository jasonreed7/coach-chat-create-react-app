var Post = require('./Post');

class TextPost extends Post {

	constructor(post, prevPost) {
		super(post, prevPost);

		this.content = post.Content;
	}

	/*	
	Splits content and returns array of objects of format
	{
		isLink: ...,
		text: ...,
		link: ... (if it is a link)
	}
	*/
	splitLinks() {
		var urlRegExp = /(\(?(?:(?:http|https|ftp):\/\/)?(?:(?:(?:[^\W\s]|\.|-|[:]{1})+)@{1})?(?:(?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(?:\d*))?(?:[\/]?[^\s\?]*[\/]{1})*(?:\/?(?:[^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?(?:[\.]{1}[^\s\?\#]*)?)?(?:\?{1}(?:[^\s\n\#\[\]]*))?(?:[\#][^\s\n]*)?\)?)/gi;

		var messageParts = this.content.split(urlRegExp);

		var resultParts = messageParts.map(function(part) {
			var result = {};

			// if part is url and not email
			if(urlRegExp.test(part) && !part.includes('@')) {
				result.isLink = true;
				result.text = part;

				var protocolRegExp = /(?:http|https|ftp):\/\//i;

				// check if link is missing protocol and if so add it
				if(!protocolRegExp.test(part)) {
					result.link = 'http://' + part;
				}
				else {
					result.link = part;
				}
			}
			else {
				result.isLink = false;
				result.text = part;
			}

			return result;
			
		});

		return resultParts;
	}

}

module.exports = TextPost;