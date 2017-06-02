import React from 'react';
var jQuery = require('jquery');
import ChatNav from './components/ChatNav/ChatNav';
import MessageList from './components/MessageList/MessageList';
import MessageForm from './components/MessageForm/MessageForm';
import TextPost from './models/TextPost';
import Attachment from './models/Attachment';
import Post from './models/Post';
require('webstorage-polyfill');

var webApiAddress = 'http://cycwebapi2.azurewebsites.net';
//var webApiAddress = 'http://cycwebconvapitest.azurewebsites.net';
//var webApiAddress = 'http://5c4e12e1.ngrok.io';
//var webApiAddress = '';

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
    var engagementAlias = user.engagementAlias;
    var clientScheduleLink;
    var clientScheduleAdminLink;


    if(user.clientScheduleLink) {
      clientScheduleLink = user.clientScheduleLink;
    }

    if(user.clientScheduleAdminLink) {
      clientScheduleAdminLink = user.clientScheduleAdminLink;
    }

    var validUser;
    if(sessionID && firstName && lastName) {
      validUser = true;
    }
    else {
      validUser = false;
    }

    return {
      messages: [],
      sessionID: sessionID,
      firstName: firstName,
      name: engagementAlias,
      messageRequestCount: 0,
      messageCount: 0,
      hasInitialMessages: false,
      validUser: validUser,
      clientScheduleLink: clientScheduleLink,
      clientScheduleAdminLink: clientScheduleAdminLink
    };
  },

  getMessages: function() {
    var that = this; 
    var messageRequestCount = this.state.messageRequestCount + 1;
    this.setState({ messageRequestCount: messageRequestCount });

    return fetch(webApiAddress + '/api/User/TeamPosts?sessionID=' + this.state.sessionID + '&plMostRecentCount=' + this.state.messageCount).then(function(response) {
      
      return response.json();

    }).then(function(response) {
      // if this is the most recent request for messages
      if(that.state.messageRequestCount === messageRequestCount && response.length > 0) {

        that.setState({ 
          messages: that.state.messages.filter(function(message) {
            return message.isUploaded;
          })
        });

        // keep count of how many unique messages have been processed
        that.setState({ messageCount: that.state.messageCount + response.length });

        var oldMessageCount = that.state.messages.length;
        var oldMessages = that.state.messages;

        //response = response.reverse();

        // messages will hold an array of messages and attachments
        var messages = [];

        for(var i = 0; i < response.length; i++) {

          var currentMessage = response[i];
          var prevPost;

          if(currentMessage.Content) {
            
            var currentPost;

            // if no previous messages
            if(oldMessages.length === 0 && messages.length === 0) {
              currentPost = new TextPost(currentMessage);
              currentPost.setDateChange(true)
            }
            else {
              prevPost = messages[messages.length - 1] || oldMessages[oldMessages.length - 1];
              currentPost = new TextPost(currentMessage, prevPost);
            }

            currentPost.setIsUploaded(true);

            messages.push(currentPost);

          }

          currentMessage.Attachments.forEach(function(attachment, attIndex) {
            
            if(attachment) {

              var currentAttachment;

              // if no previous messages
              if(oldMessages.length === 0 && messages.length === 0) {
                currentAttachment = new Attachment(currentMessage, undefined, attachment, attIndex);
                currentAttachment.setDateChange(true);
              }
              else {
                prevPost = messages[messages.length - 1] || oldMessages[oldMessages.length - 1];
                currentAttachment = new Attachment(currentMessage, prevPost, attachment, attIndex);
              }

              currentAttachment.setIsUploaded(true);

              messages.push(currentAttachment);

            }

          });

        }

        that.setState({ messages: that.state.messages.concat(messages) });
      }

      // if this is first update, set interval on updating messages
      if(!that.state.hasInitialMessages) {
        setInterval(that.getMessages, 10000);
        that.setState({hasInitialMessages: true});
      }
    });
  },

  optimisticallyUpdate: function(message) {
    var postTime = new Date();
    var messages = this.state.messages;

    var textPost = new TextPost({
      Content: message,
      Poster: this.state.name,
      PostTime: postTime
    });

    if(messages.length === 0) {
      textPost.setDateChange(true);
    }
    else {
      var prevPost = messages[messages.length - 1];
      textPost.setDateChange(prevPost.postTime);
    }

    this.setState({ messages: messages.concat([textPost]) });

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

  sendFile: function(file, fileName) {
    var that = this;
    
    //var file = e.target.files[0];

    var reader = new FileReader();
    var reader2 = new FileReader();

    reader.readAsDataURL(file);
    
    reader.onload = function(fileEvent) {
      that.optimisticallyAddFile(file, fileEvent, fileName);

      var formData = new FormData();

      var data = new FormData();
        data.append("file", file);

        jQuery.ajax({
          type: "PUT",
          url: webApiAddress + '/api/User/UploadFile?SessionID=' + that.state.sessionID + '&Filename=' + fileName,
          //url: "/API/document/upload/" + file.name + "/" + encodedString ,
          contentType: false,
          processData: false,
          data: data
        }).done(function(response) {
          setTimeout(that.getMessages, 1000);
        });

    };

  },

  optimisticallyAddFile: function(file, fileEvent, fileName) {

    var messages = this.state.messages;

    var post = {
      PostTime: new Date(),
      Poster: this.state.name
    };

    var attachmentProps = {
      AName: fileName,
      Atype: file.type
    };

    if(file.type.startsWith('image')) {
      attachmentProps.dataURL = fileEvent.target.result;
    }

    var attachment = new Attachment(post, undefined, attachmentProps);

    attachment.setIsUploaded(false);

    if(messages.length === 0) {
      attachment.setDateChange(true);
    }
    else {
      var prevPost = messages[messages.length - 1];
      attachment.setDateChange(prevPost.postTime);
    }

    this.setState({ messages: messages.concat([attachment]) });

  },

  // Resize message list for when textarea resizes
  resizeMessageList: function(){
    var $messageList = jQuery('.message-list');
    var $messageForm = jQuery('.message-form');
    var topPaddingPixels = 20;

    var newHeight = 'calc(100% - ' + ($messageForm.outerHeight() + topPaddingPixels)+ 'px)';

    $messageList.css('height', newHeight);
  },

  isAppleMobile: function() {
    return /(iPhone|iPod)/g.test( navigator.userAgent );
  },

  componentDidMount: function() {
    this.getMessages();
  },

  render: function() {
    return (
      <div>
        <ChatNav firstName={this.state.firstName} 
          clientScheduleLink={this.state.clientScheduleLink} 
          clientScheduleAdminLink={this.state.clientScheduleAdminLink}
        />
        <div className="app">
          <img style={{position: 'absolute'}} ref={(img) => {this.img = img;}} />
          <MessageList messages={this.state.messages} hasInitialMessages={this.state.hasInitialMessages} validUser={this.state.validUser} />
          <MessageForm sendMessage={this.sendMessage} resizeMessageList={this.resizeMessageList} sendFile={this.sendFile} isAppleMobile={this.isAppleMobile()} />
        </div>
      </div>
    );
  } 
});

export default App;

