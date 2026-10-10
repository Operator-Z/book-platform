package com.bookplatform.library.service;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.bookplatform.library.dto.OpenLibraryDoc;
import com.bookplatform.library.dto.OpenLibraryResponse;
import com.bookplatform.library.entity.Book;
import com.bookplatform.library.repository.BookRepository;

import jakarta.annotation.PostConstruct;

@Service
public class BookFetchService {

    @Autowired
    private BookRepository bookRepository;

    private static final String API_URL = "https://openlibrary.org/search.json?q=fiction&limit=100";

    @PostConstruct
    public void fetchAndSaveBooksOnStartup() {
        if (bookRepository.count() >= 100) {
            System.out.println("Database already contains the initial catalog. Skipping fetch.");
            return;
        }

        RestTemplate restTemplate = new RestTemplate();
        System.out.println("Fetching initial book catalog from Open Library API...");
        
        try {
            OpenLibraryResponse response = restTemplate.getForObject(API_URL, OpenLibraryResponse.class);
            
            if (response != null && response.getDocs() != null) {
                List<Book> booksToSave = new ArrayList<>();
                
                for (OpenLibraryDoc doc : response.getDocs()) {
                    Book book = new Book();
                    book.setName(doc.getTitle() != null ? doc.getTitle() : "Unknown Title");
                    
                    if (doc.getAuthorName() != null && !doc.getAuthorName().isEmpty()) {
                        book.setAuthor(doc.getAuthorName().get(0));
                    } else {
                        book.setAuthor("Unknown Author");
                    }
                    
                    if (doc.getIsbn() != null && !doc.getIsbn().isEmpty()) {
                        book.setIsbn(doc.getIsbn().get(0));
                    } else {
                        book.setIsbn("N/A");
                    }
                    
                    if (doc.getCoverId() != null) {
                        book.setCoverPageIllustration("https://covers.openlibrary.org/b/id/" + doc.getCoverId() + "-L.jpg");
                    } else {
                        book.setCoverPageIllustration("No Cover Available");
                    }

                    book.setDescription("Standard description fetched from Open Library.");
                    
                    booksToSave.add(book);
                }
                
                bookRepository.saveAll(booksToSave);
                System.out.println("Successfully saved " + booksToSave.size() + " books to the database.");
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch books from external API: " + e.getMessage());
        }
    }
}

