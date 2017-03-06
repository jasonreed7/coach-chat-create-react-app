import React from 'react';
var jQuery = require('jquery');
import MessageList from './components/MessageList/MessageList';
import MessageForm from './components/MessageForm/MessageForm';

var webApiAddress = 'http://cycwebapi2.azurewebsites.net';

function sameDate(date1, date2) {
  return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
}

var App = React.createClass({
  
  getInitialState: function() {

    //Retrieve session data
    var user = {};


    var storedData = sessionStorage.getItem("user");

    if(storedData) {
      user = JSON.parse(storedData);
    }

    var sessionID = user.sessionID;
    var firstName = user.firstName;
    var lastName = user.lastName;

    return {
      messages: [],
      sessionID: sessionID,
      name: firstName + ' ' + lastName
    };
  },

  getMessages: function() {
    var that = this; 

    return fetch(webApiAddress + '/api/User/TeamPosts?sessionID=' + this.state.sessionID + '&plMostRecentCount=0').then(function(response) {
      return response.json();
    }).then(function(response) {
      response = response.reverse();

      // Handle first message
      if(response[0]) {
        var firstMessage = response[0];
        firstMessage.PostTime = new Date(firstMessage.PostTime);
        firstMessage.DateChange = true;
      }

      for(var i = 0; i < response.length - 1; i++) {
        var currentMessage = response[i];

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
      Poster: this.state.name,
      PostTime: postTime,
      DateChange: dateChange 
    }]) });

  },

  sendMessage: function(message) {
    var that = this;

    this.optimisticallyUpdate(message);

    return new Promise(function(resolve, reject) {
      jQuery.ajax({
        url: webApiAddress + '/api/User/TeamPost',
        method: 'PUT',
        data: {
          Content: message,
          SessionID: that.state.sessionID,
          Subject: 'Test'
        }
      }).done(function() {
      	/* 
      	Wait enought time for new message to be in datastore- need to come up with 
      	better strategy/ figure out if 1 sec is consistently enough
      	*/
        setTimeout(that.getMessages, 1000);
        resolve();
      });
    });
  },

  sendFile: function(e) {
    var that = this;
    
    var file = e.target.files[0];

    var reader = new FileReader();

    reader.readAsDataURL(file);
    
    reader.onload = function(fileEvent) {
      that.img.src = fileEvent.target.result;
    };

  },

  // Resize message list for when textarea resizes
  resizeMessageList: function(){
    var $messageList = jQuery('.message-list');
    var $messageForm = jQuery('.message-form');
    var topPaddingPixels = 20;

    var newHeight = 'calc(100% - ' + ($messageForm.outerHeight() + topPaddingPixels)+ 'px)';

    $messageList.css('height', newHeight);
  },

  componentDidMount: function() {
    this.getMessages();
  },

  render: function() {
    return (
      <div>
        <img style={{position: 'absolute'}} ref={(img) => {this.img = img;}} />
        <MessageList messages={this.state.messages} />
        <MessageForm sendMessage={this.sendMessage} resizeMessageList={this.resizeMessageList} sendFile={this.sendFile} />
      </div>
    );
  } 
});

export default App;

