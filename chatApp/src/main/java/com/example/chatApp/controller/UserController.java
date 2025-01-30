package com.example.chatApp.controller;

import com.example.chatApp.dto.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class UserController {
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor messageHeaderAccessor){
        // Store the username in the WebSocket session attributes, so it can be retrieved later,
        // particularly in the WebsocketEventListener class when handling disconnection events.
        messageHeaderAccessor.getSessionAttributes().put("username", chatMessage.getSender());

        // Return the ChatMessage object, which will be broadcast to all subscribers of "/topic/public"
        // because we used the '@SendTo("/topic/public")' annotation above this method
        return chatMessage;
    }
}
