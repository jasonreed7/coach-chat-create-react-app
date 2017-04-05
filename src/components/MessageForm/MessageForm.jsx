var React = require('react');
var TextArea = require('react-textarea-autosize').default;
var Modal = require('react-overlays/lib/Modal');


var modalStyle = {
  position: 'fixed',
  zIndex: 1040,
  top: 0, bottom: 0, left: 0, right: 0
};

var backdropStyle = {
  ...modalStyle,
  zIndex: 'auto',
  backgroundColor: '#000',
  opacity: 0.5
};

var dialogStyle = {
	position: 'absolute',
	width: 400,
	maxWidth: '80%',
	top: '50%', 
	left: '50%',
	transform: 'translate(-50%, -50%)',
	border: '1px solid #e5e5e5',
	backgroundColor: 'white',
	boxShadow: '0 5px 15px rgba(0,0,0,.5)',
	padding: 20
};

var MessageForm = React.createClass({
	getInitialState: function() {
		return { 
			userInput: '',
			fileName: '',
			file: null,
			showModal: false
		};
	},

	handleUserInput: function(e) {
		this.setState({
			userInput: e.target.value
		});
	},

	sendMessage: function() {
		var userInput = this.state.userInput;


		this.setState({ userInput: '' });

		if(userInput.trim() != '') {
			this.props.sendMessage(userInput);
			this.textArea.focus();
		}
	},

	// Set filename and send to App.sendFile
	sendFile: function() {
		this.props.sendFile(this.state.file, this.state.fileName);
		this.closeModal();
	},

	hasUserInput: function() {
		return this.state.userInput != '';
	},

	// Open modal and save file event to state
	startFileDialog: function(e) {
		this.setState({ 
			showModal: true,
			file: e.target.files[0],
			fileName: e.target.files[0].name
		});
	},

	handleFileNameChange: function(e) {
		this.setState({ fileName: e.target.value }); },

	closeModal: function() {
		this.setState({ showModal: false });
	},

	render: function() {

		var fileInput;

		if(!this.hasUserInput()) {
			fileInput = [(
					
					<input type="file" id="file-input" className="file-input" onChange={this.startFileDialog} />
				),
				(
					<label htmlFor="file-input" className="file-input-label">
						<i className="fa fa-paperclip" aria-hidden="true"></i>
					</label>
				)];
		}

		return (
			<div className="message-form">
				<TextArea className={ "message-input " + ( this.hasUserInput() ? "has-input" : "" ) + (this.props.isAppleMobile ? " text-16": "")} value={this.state.userInput} onChange={this.handleUserInput} onHeightChange={this.props.resizeMessageList}
				ref = { (textArea) => { this.textArea = textArea; } }/>
				{fileInput}
				<button className="btn btn-orange" onClick={this.sendMessage}>Send Message</button>
				<Modal 
					show={this.state.showModal}
					style={modalStyle}
          			backdropStyle={backdropStyle}
				>
					<div style={dialogStyle}>
						<div className="file-name-container">
							<label htmlFor="file-name">File name: </label>
							<input 
								id="file-name"
								type="text" 
								value={this.state.fileName} 
								onChange={this.handleFileNameChange}
          						className={this.props.isAppleMobile ? "text-16": ""}
							/>
						</div>
						<div>
							<button className="btn btn-gray btn-cancel" onClick={this.closeModal}>Cancel</button>
							<button className="btn btn-orange" onClick={this.sendFile}>Send</button>
						</div>
					</div>
				</Modal>
			</div>
		);
	}
});

module.exports = MessageForm;