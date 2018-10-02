import { Component, OnInit, AfterViewChecked, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NgModule, Input } from '@angular/core';
import {NgForm} from '@angular/forms';
import { MyAuthService } from '../../services/auth.service';
import { ConversationService } from '../../services/conversation.service';
import { Socket } from 'ng-socket-io';
import { NgProgress } from '@ngx-progressbar/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @Input() currentUser: any;
  conversationObj: any = {
                        "params": {
                          "input": {"text": ""},
                          "context": {
                                        "metadata": {
                                          "deployment": environment.deployment
                                        },
                                        "initConversation": true,
                                        "locale": "en",
                                        "channel": "WEB",
                                        "save_in_db": false
                                      }
                        }
                      };
  conversations: any = [];

  showDetails = false;
  collectionName = null;

  @ViewChild('chatRow') chatRow: ElementRef;
  @ViewChild('chatInputTxt') chatInputTxtElement: ElementRef;

  constructor(private authService: MyAuthService, public conversationService: ConversationService,
    private socket: Socket, public progress: NgProgress) {

  }

  ngOnInit() {
    var that = this;
      this.authService.userAuth.subscribe(function(userData){
        that.currentUser = userData;
        if(that.currentUser && that.currentUser.id){
          that.refreshConversation();
        }else{
          that.conversationObj.params.context.initConversation = true;
          delete that.conversationObj.params.context.metadata["user_id"];
        }
      });
  }

  ngAfterViewInit(){
      if(this.currentUser && this.currentUser.id){
          this.fetchConversationResponse();
      }
  }

  ngAfterViewChecked() {
        // this.scrollToBottom();
        // this.socket.emit("/CHAT/POST", "PAGE LOADED >>> ");
  }

  highlightReqResp(){
    console.log(this.conversations[this.conversations.length - 1]);
  }

  scrollToBottom = (): void => {
    try {
      this.chatRow.nativeElement.scrollTop = this.chatRow.nativeElement.scrollHeight;
      this.chatInputTxtElement.nativeElement.focus();
    } catch (err) {}
  }

  refreshConversation(){
    console.log("In refreshConversation: >>> ");
    this.conversations = [];
    this.conversationObj = {
                          "params": {
                            "input": {"text": ""},
                            "context": {
                                          "metadata": {
                                            "deployment": environment.deployment
                                          },
                                          "initConversation": true,
                                          "locale": "en",
                                          "channel": "WEB",
                                          "save_in_db": false
                                        }
                          }
                        };
      if(this.currentUser && this.currentUser.id){
        this.conversationObj.params.context.metadata["user_id"] = this.currentUser.id;
        if(this.conversationObj.params.context.initConversation){
          this.fetchConversationResponse();
        }
      }else{
        console.log("No User Found......");
      }
  }

  checkIfEnterPressed(e){
    if(e.keyCode == 13){
      console.log("Enter Key Is Hit: >> ");
        // this.fetchConversationResponse();
    }
  }

  showSegmentDetails(){
      this.showDetails = !this.showDetails;
  }

  handleMessageFromWatson(msg){
    console.log("Conversation API Response: >>> ", msg);
    if(msg && msg.conversation){
      msg = this.formatOutputResp(msg);
      this.appendOrPushConversation(msg);
      console.log("Conversations Array:  ", this.conversations);
      this.conversationObj.params.input = {"text": ""};
      this.conversationObj.params.context = msg.conversation.context;
      this.scrollToBottom();
    }
    this.progress.done();
  }

  appendOrPushConversation(msg){
    console.log("IN appendOrPushConversation: >> ", msg.conversation.context.next_action);
    if(msg.conversation.context && msg.conversation.context.next_action){
          this.conversationObj.status = msg.conversation.context.next_action.status;
          if(msg.conversation.context.next_action == "append"){
            for(let t of msg.conversation.output.text){
                this.conversations[this.conversations.length - 1].output.text.push(t);
            }
            msg.conversation.context.next_action = "completed";
            if(msg.conversation.searchResults){
              this.conversations[this.conversations.length - 1].searchResults = msg.conversation.searchResults;
            }
          }else{
            this.conversations.push(msg.conversation);
          }

          this.conversations[this.conversations.length - 1].context = msg.conversation.context;

    }else{
        this.conversations.push(msg.conversation);
    }
  }

  fetchConversationResponse(){
        if(!this.conversationObj.params.context.initConversation &&
          (!this.conversationObj.params.input.text || this.conversationObj.params.input.text == "")){
            return false;
        }

        if(this.currentUser){
          if(this.conversationObj.params.context.metadata){
            this.conversationObj.params.context.metadata["user_id"] = this.currentUser.id;
          }else{
            this.conversationObj.params.context.metadata = {
                "user_id": this.currentUser.id
            }
          }
        }else{
           this.authService.getUserInfo(false).then(result => {
                this.currentUser = result;
                this.conversationObj.params.context.metadata["user_id"] = this.currentUser.id;
           },
           error => {
              console.log("ERROR: >>> ", error);
           });
        }

        // delete this.conversationObj.params.context["new_output_text"];
        this.conversationObj.params.timestamp = new Date();
        this.progress.start();
        console.log("\n\nIN fetchConversationResponse, conversationObj:>>  ", this.conversationObj);
        this.conversationService.callConversation(this.conversationObj).then( result => {
            this.conversationObj.params.context.initConversation = false;
            if(this.collectionName == null && result.conversation.context && result.conversation.context.conversation_id){
              this.collectionName = "/"+result.conversation.context.conversation_id+"/POST";
              this.socket.on(this.collectionName, (msg) => {
                console.log('socket.message: >>>>> ', msg);
                this.handleMessageFromWatson(msg);
              });
            }

            this.handleMessageFromWatson(result);
       },
       error => {
          this.progress.done();
          console.log("ERROR: >>> ", error);
       });
  }

  formatOutputResp(result){
    result.conversation.input.timestamp = this.conversationObj.params.timestamp;
    result.conversation.output.timestamp = new Date();
    return result;
  }

  provideFeedback(dialog, feedback){
    console.log("IN provideFeedback, feedback: >> ", feedback, ", Dialog: >>> ", dialog)
  }

}
