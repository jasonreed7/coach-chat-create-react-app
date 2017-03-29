class Post  {

	constructor(post, prevPost) {
		this.id = post.id;
		this.content = post.Content;
		this.poster = post.Poster;
		this.firstName = post.FirstName;
		this.lastName = post.LastName;
		this.postTime = new Date(post.PostTime);

		if(prevPost) {
			this.dateChange = !this.sameDay(prevPost.postTime, this.postTime);
		}
	}

	// Check if other date is on same day as this.postTime
	sameDay(otherDate) {
		var date = this.postTime;
		return date.getDate() === otherDate.getDate() && date.getMonth() === otherDate.getMonth() && date.getFullYear() === otherDate.getFullYear();
	}

	// Takes boolean or another date to compare
	setDateChange(dateChangeParam) {
		var paramType = typeof dateChangeParam;

		// If param is boolean
		if(paramType === 'boolean') {
			this.dateChange = paramType;
		}
		// If param is object, presumably Date
		else if(paramType === 'object') {
			this.dateChange = !this.sameDay(dateChangeParam);
		}
	}

	setIsUploaded(isUploaded) {
		this.isUploaded = isUploaded;
	}

}

module.exports = Post;
