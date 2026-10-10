package com.bookplatform.library.dto;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenLibraryDoc {
    private String title;
    
    @JsonProperty("author_name")
    private List<String> authorName;
    
    private List<String> isbn;
    
    @JsonProperty("cover_i")
    private Long coverId;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public List<String> getAuthorName() { return authorName; }
    public void setAuthorName(List<String> authorName) { this.authorName = authorName; }
    public List<String> getIsbn() { return isbn; }
    public void setIsbn(List<String> isbn) { this.isbn = isbn; }
    public Long getCoverId() { return coverId; }
    public void setCoverId(Long coverId) { this.coverId = coverId; }
}
