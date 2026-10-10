package com.bookplatform.library.controller;

import com.bookplatform.library.dto.ChatMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    // Receives messages sent to /app/chat/{roomId} and broadcasts to /topic/room/{roomId}
    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public ChatMessage sendMessage(@DestinationVariable Long roomId, ChatMessage chatMessage) {
        return chatMessage;
    }
}