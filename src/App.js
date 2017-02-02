import React from 'react';
var jQuery = require('jquery');
import MessageList from './components/MessageList/MessageList';
import MessageForm from './components/MessageForm/MessageForm';

function sameDate(date1, date2) {
  return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
}

var App = React.createClass({
  
  getInitialState: function() {
    return {
      messages: []
    };
  },

  getMessages: function() {
    var that = this; 

    return fetch('http://cycwebapi2.azurewebsites.net/api/User/TeamPosts?sessionID=14246').then(function(response) {
      return response.json();
    }).then(function(response) {
      response = response.reverse();

      for(var i = 0; i < response.length - 1; i++) {
        var currentMessage = response[i];

        if(i === 0) {
          currentMessage.PostTime = new Date(currentMessage.PostTime);
          currentMessage.DateChange = true;
        }

        var nextMessage = response[i + 1];
        nextMessage.PostTime = new Date(nextMessage.PostTime);

        // if currentMessage and nextMessage dates are different
        if(!sameDate(currentMessage.PostTime, nextMessage.PostTime)) {
          nextMessage.DateChange = true;
        }
        else {
          nextMessage.DateChange = false;
        }
      }

      that.setState({messages: response});
    });
  },

  optimisticallyUpdate: function(message) {
    var postTime = new Date();
    var messages = this.state.messages;
    var dateChange;

    if(messages.length === 0) {
      dateChange = true;
    }
    else {
      var previousMessage = messages[messages.length - 1];
      dateChange = !sameDate(previousMessage.PostTime, postTime);
    }

    this.setState({ messages: messages.concat([{
      Content: message,
      Poster: 'Bob',
      PostTime: postTime,
      DateChange: dateChange 
    }]) });

  },

  sendMessage: function(message) {
    var that = this;

    this.optimisticallyUpdate(message);

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
        setTimeout(that.getMessages, 1000);
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

