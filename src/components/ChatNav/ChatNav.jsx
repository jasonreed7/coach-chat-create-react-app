var React = require('react');

var ChatNav = React.createClass({

	getInitialState: function() {
		return { open: false };
	},

	openMenu: function() {
		this.setState({ open: true });
	},

	closeMenu: function() {
		this.setState({ open: false });
	},

	render: function() {
		var clientScheduleLink = this.props.clientScheduleLink;
		var clientScheduleAdminLink = this.props.clientScheduleAdminLink;

		var mobileMenu = (
			<div className="mobile-menu">
				<div className="menu-item">
					<a href={ clientScheduleLink ? clientScheduleLink : '' }>HOME</a>
				</div>
				<div className="menu-item">
					<a href={ clientScheduleAdminLink ? clientScheduleAdminLink : '' }>VIEW ACCOUNT</a>
				</div>
			</div>
		);

		return (
			<div>
				<nav className="chat-nav">
					<div className="desktop-nav">
						<div className="nav-logo-container nav-left">
							<a href={ clientScheduleLink ? clientScheduleLink : '' }>
								<img className="nav-logo" src="/pictures/cyc-logo.jpg" />
							</a>
						</div>
						<div className="nav-account-link-container nav-right nav-item">
							<a href={ clientScheduleAdminLink ? clientScheduleAdminLink : '' }>Hi {this.props.firstName}!</a>
						</div>
					</div>
					<div className="mobile-nav">
						<div className="nav-logo-container">
							<a href={ clientScheduleLink ? clientScheduleLink : '' }>
								<img className="nav-logo" src="/pictures/cyc-logo-mobile.jpg" />
							</a>
						</div>
						{ this.state.open ? '' : (
							<button className="nav-right-mobile hamburger-button"
								onClick={this.openMenu}
							>
								<img className="hamburger" src="/pictures/buttons/hamburger-icon.jpg" />
							</button>
						)
						}
					</div>
				</nav>
				{ this.state.open ? 
					(
						<div className="mobile-menu">
							<div className="close-menu-container">
								<button className="close-menu" 
									onClick={this.closeMenu}
								>X</button>
							</div>
							<div className="mobile-menu-item">
								<a className="mobile-menu-link" href={ clientScheduleLink ? clientScheduleLink : '' }>HOME</a>
							</div>
							<div className="mobile-menu-item">
								<a className="mobile-menu-link" href={ clientScheduleAdminLink ? clientScheduleAdminLink : '' }>VIEW ACCOUNT</a>
							</div>
						</div>
					)
					: '' }
			</div>
		);
	}

});

module.exports = ChatNav;