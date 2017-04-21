var Post = require('./Post');

class Attachment extends Post {

	constructor(post, prevPost, attachment, index) {
		super(post, prevPost);

		this.name = attachment.AName;
		this.uri = attachment.AURI;
		this.extension = attachment.Extension;
		this.type = attachment.Atype;

		// set id different from message
		if(index !== undefined) {
			this.id += '-att-' + index;
		}

		if(attachment.dataURL) {
			this.dataURL = attachment.dataURL;
		}
	}

	isWebImage() {
		var webImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg'];

		return webImageExtensions.includes(this.extension)  || this.type.startsWith('image');
	}

}

module.exports = Attachment;