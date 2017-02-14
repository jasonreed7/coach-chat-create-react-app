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

      // Doesn't go into for loop if only one message
      if(response.length == 1) {
        var firstMessage = response[0];
        firstMessage.PostTime = new Date(firstMessage.PostTime);
        firstMessage.DateChange = true;
        firstMessage.Content = firstMessage.Content.replace('<!doctype html> <html lang="en"> <head>  <meta charset="utf-8" ></head><body><div class="section" style="margin-bottom: 10px;">', '')
            .replace('<br><br><a href=mailto:ENGAGEMENT1@GOALSPRIING.COM>Send a new post to the team</a><br></div></body></html>','');
      }

      for(var i = 0; i < response.length - 1; i++) {
        var currentMessage = response[i];

        if(i === 0) {
          currentMessage.PostTime = new Date(currentMessage.PostTime);
          currentMessage.DateChange = true;
          currentMessage.Content = currentMessage.Content.replace('<!doctype html> <html lang="en"> <head> <meta charset="utf-8" ></head><body><div class="section" style="margin-bottom: 10px;">', '')
            .replace('<br><br><a href=mailto:ENGAGEMENT1@GOALSPRIING.COM>Send a new post to the team</a><br></div></body></html>', '');
        }

        var nextMessage = response[i + 1];
        nextMessage.PostTime = new Date(nextMessage.PostTime);
        nextMessage.Content = nextMessage.Content.replace('<!doctype html> <html lang="en"> <head>  <meta charset="utf-8" ></head><body><div class="section" style="margin-bottom: 10px;">', '')
            .replace('<br><br><a href=mailto:ENGAGEMENT1@GOALSPRIING.COM>Send a new post to the team</a><br></div></body></html>','');
        

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
        <MessageList messages={this.state.messages} />
        <MessageForm sendMessage={this.sendMessage} resizeMessageList={this.resizeMessageList} />
      </div>
    );
  } 
});

export default App;

