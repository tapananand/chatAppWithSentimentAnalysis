import React from 'react';

const ChatMessage = ({ message, position = "left" }) => {
    const isRight = position === "right";
    const align = isRight ? 'text-right' : 'text-left';
    const justify = isRight ? 'justify-content-end' : 'justify-content-start';
    const messageBoxStyles = {
        maxWidth: '70%',
        flexGrow: 0
    };
      
    const messageStyles = {
        fontWeight: 500,
        lineHeight: 1.4,
        whiteSpace: 'pre-wrap'
    };
    
    return (
        <div className={`w-100 my-1 d-flex ${justify}`}>
            <div className="bg-light rounded border border-gray p-2" style={messageBoxStyles}>
                <span className={`d-block text-secondary ${align}`} style={messageStyles}>
                    {message}
                </span>
            </div>
        </div>
    );
};

export default ChatMessage;