package com.bookplatform.library.entity;
import jakarta.persistence.*;

@Entity
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String author;
    private String isbn;
    
    @Column(name = "cover_page_illustration")
    private String coverPageIllustration;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    // Default Constructor
    public Book() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public String getCoverPageIllustration() { return coverPageIllustration; }
    public void setCoverPageIllustration(String coverPageIllustration) { this.coverPageIllustration = coverPageIllustration; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}