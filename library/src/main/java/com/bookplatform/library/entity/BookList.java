package com.bookplatform.library.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class BookList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // e.g., "Top50 parlies" or "My-pv-list"

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    private int upvotes = 0;
    private int downvotes = 0;

    @ManyToMany
    @JoinTable(
        name = "booklist_books", 
        joinColumns = @JoinColumn(name = "booklist_id"), 
        inverseJoinColumns = @JoinColumn(name = "book_id")
    )
    private List<Book> books = new ArrayList<>();

    public BookList() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public User getCreator() { return creator; }
    public void setCreator(User creator) { this.creator = creator; }
    public int getUpvotes() { return upvotes; }
    public void setUpvotes(int upvotes) { this.upvotes = upvotes; }
    public int getDownvotes() { return downvotes; }
    public void setDownvotes(int downvotes) { this.downvotes = downvotes; }
    public List<Book> getBooks() { return books; }
    public void setBooks(List<Book> books) { this.books = books; }
}