package com.bookplatform.library.dto;

public class ChatMessage {
    private String sender;
    private String content;
    private Long roomId;

    public ChatMessage() {}

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }
}