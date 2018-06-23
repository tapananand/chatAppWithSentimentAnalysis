import React, { Component, Fragment } from 'react';
import Pusher from "pusher-js";
import axios from "axios";
import ChatMessage from './ChatMessage';
    
const SAD_EMOJI = [55357, 56864];
const HAPPY_EMOJI = [55357, 56832];
const NEUTRAL_EMOJI = [55357, 56848];

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            chats: []
         };
    }

    componentDidMount() {
        // Enable pusher logging - don't include this in production
        Pusher.logToConsole = true;

        this.pusher = new Pusher(PUSHER_APP_KEY, {
            cluster: PUSHER_APP_CLUSTER,
            encrypted: true
        });

        let channel = this.pusher.subscribe("chat-messages");
        channel.bind("new-message", (message) => {
            if(message) {
                this.setState(() => {
                    return {
                        chats: [
                            ...this.state.chats,
                            message
                        ]
                    }
                });
            }
        });

        this.pusher.connection.bind("connected", () => {
            axios.get("/messages").then((response) => {
                const chats = response.data.messages;
                this.setState(() => ({
                    chats
                }));
            });
        });
    }

    componentWillUnmount() {
        this.pusher.disconnect();
    }

    handleKeyUp = (evt) => {
        if(evt.keyCode === 13 && !evt.shiftKey) {
            const value = evt.target.value;
            axios.post("/message", {
                user: this.props.currUser,
                message: value,
                timeStamp: new Date().toString()
            });

            evt.target.value = "";
        }
    }

    render() {
        return (
            <Fragment>
                <div 
                    className="border-bottom border-gray w-100 d-flex align-items-center bg-white" 
                    style={{ height: 90 }}
                >
                    <h2 className="text-dark mb-0 mx-4 px-2">{this.props.currUser}</h2>
                </div>

                <div 
                    className={`px-4 pb-4 w-100 d-flex flex-row flex-wrap align-items-start 
                        align-content-start position-relative`}
                    style={{ height: 'calc(100% - 180px)', overflowY: 'scroll' }}
                >
                    { 
                        this.state.chats.map((chat, index) => {
                            const position = ((chat.user === this.props.currUser) ? "right" : "left");
                            const previous = Math.max(0, index - 1);
                            const previousChat = this.state.chats[previous];

                            const isFirst = previous === index;
                            const inSequence = previousChat.user === chat.user;
                            const hasDelay = Math.ceil((chat.timeStamp - previousChat.timeStamp) / 1000) > 60;
                            const mood = chat.sentimentScore > 0 
                                ? HAPPY_EMOJI 
                                : (chat.sentimentScore === 0 ? NEUTRAL_EMOJI : SAD_EMOJI);
        
                            return (
                                <Fragment key={index}>
                                    { 
                                        (isFirst || !inSequence || hasDelay) && (
                                            <div 
                                                className={`d-block w-100 font-weight-bold 
                                                    text-dark mt-4 pb-1 px-1 text-${position}`} 
                                                style={{ fontSize: '0.9rem' }}
                                            >
                                                <span className="d-block" style={{ fontSize: '1.6rem' }}>
                                                    {String.fromCodePoint(...mood)}
                                                </span>
                                                <span>{chat.user || 'Anonymous'}</span>
                                            </div>
                                        )
                                    }
                                    <ChatMessage message={chat.message} position={position}/>
                                </Fragment>
                            );
                        })
                    }
                </div>

                <div 
                    className="border-top border-gray w-100 px-4 d-flex align-items-center bg-light" 
                    style={{ minHeight: 90 }}
                >
                    <textarea className="form-control px-3 py-2" 
                        onKeyUp={this.handleKeyUp} 
                        placeholder="Enter a chat message" 
                        style={{ resize: 'none' }}
                    ></textarea>
                </div>
            </Fragment>
        );
    }
}

export default Chat;