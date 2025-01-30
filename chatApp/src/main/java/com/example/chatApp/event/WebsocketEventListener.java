package com.example.chatApp.event;

import com.example.chatApp.dto.ChatMessage;
import com.example.chatApp.enums.MessageType;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
public class WebsocketEventListener {

    private final SimpMessageSendingOperations messageSendingOperations;
    @EventListener
    public void handleWebsocketDisconnectListener(SessionDisconnectEvent sessionDisconnectEvent){
        // Wrap the SessionDisconnectEvent message to access STOMP-specific headers
        StompHeaderAccessor stompHeaderAccessor = StompHeaderAccessor.wrap(sessionDisconnectEvent.getMessage());

        // Retrieve the username from the session attributes inside the STOMP Header.
        String username = (String)stompHeaderAccessor.getSessionAttributes().get("username");

        if (username != null){
            System.out.println("User Disconnected:"+ username);

            // var in Java is a local variable type inference feature introduced in Java 10.
            // var chatMessage: The compiler automatically infers the type of chatMessage based on the right-hand side (RHS).
            var chatMessage = ChatMessage.builder()
                    .messageType(MessageType.LEAVE)
                    .sender(username)
                    .build();

            // Equivalent Java 9 or earlier version:
            // ChatMessage chatMessage = ChatMessage.builder()
            //        .messageType(MessageType.LEAVE)
            //        .sender(username)
            //        .build();

            // Notify all connected users that a specific user has left the chat.
            // This is done using 'SimpMessageSendingOperations' and its convertAndSend() method,
            // which sends the chat message to the "/topic/public" destination.
            messageSendingOperations.convertAndSend("/topic/public", chatMessage);
        }
    }
}
