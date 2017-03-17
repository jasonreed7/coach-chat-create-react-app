class TextPost extends Post {
	constructor(post, prevPost) {
		super(post, prevPost);

		this.Content = post.Content;
	}

	getJSX() {

	}
}