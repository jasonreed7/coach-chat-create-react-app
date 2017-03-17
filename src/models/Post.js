class Post  {

	constructor(post, prevPost) {
		this.Content = post.Content;
		this.Poster = post.Poster;
		this.PostTime = post.postTime;

		if(!prevPost) {
			this.DateChange = true;
		}
		else {
			this.DateChange = !Post.sameDate(prevPost.PostTime, this.PostTime);
		}
	}

	// Static method to check if dates are on same day
	static sameDate(date1, date2) {
	  return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
	}

}
