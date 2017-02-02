import React from 'react';
var jQuery = require('jquery');
import MessageList from './components/MessageList/MessageList';
import MessageForm from './components/MessageForm/MessageForm';

var App = React.createClass({
  
  getInitialState: function() {
    return {
      messages: []
    };
  },

  getMessages: function() {
    var that = this; 

    fetch('http://cycwebapi2.azurewebsites.net/api/User/TeamPosts?sessionID=14246').then(function(response) {
      return response.json();
    }).then(function(response) {
      that.setState({messages: response});
    });
  },

  sendMessage: function(message) {
    var that = this;

    return new Promise(function(resolve, reject) {
      jQuery.ajax({
        url: 'http://cycwebapi2.azurewebsites.net/api/User/TeamPost',
        method: 'PUT',
        data: {
          Content: message,
          SessionID: 14246,
          Subject: 'Test'
        }
      }).done(function() {
        setTimeout(that.getMessages, 280);
        resolve();
      });
    });
  },

  componentDidMount: function() {
    this.getMessages();
  },

  render: function() {
    return (
      <div>
        <MessageList messages={this.state.messages} />
        <MessageForm sendMessage={this.sendMessage} />
      </div>
    );
  } 
});

export default App;

