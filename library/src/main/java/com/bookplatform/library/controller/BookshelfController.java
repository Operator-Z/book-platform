package com.bookplatform.library.controller;

import com.bookplatform.library.entity.Book;
import com.bookplatform.library.entity.BookshelfItem;
import com.bookplatform.library.entity.ReadingStatus;
import com.bookplatform.library.entity.User;
import com.bookplatform.library.repository.BookRepository;
import com.bookplatform.library.repository.BookshelfItemRepository;
import com.bookplatform.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/bookshelf")
public class BookshelfController {

    @Autowired
    private BookshelfItemRepository bookshelfItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    // Endpoint to add a book to the user's library with an initial status
    @PostMapping("/{userId}/add/{bookId}")
    public ResponseEntity<String> addBookToShelf(@PathVariable Long userId, 
                                                 @PathVariable Long bookId, 
                                                 @RequestParam ReadingStatus status) {
        
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Book> bookOpt = bookRepository.findById(bookId);

        if (userOpt.isEmpty() || bookOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User or Book not found.");
        }

        // Check if the book is already on the user's shelf
        Optional<BookshelfItem> existingItem = bookshelfItemRepository.findByUserIdAndBookId(userId, bookId);
        if (existingItem.isPresent()) {
            return ResponseEntity.badRequest().body("Book is already on the user's bookshelf. Use update endpoint instead.");
        }

        BookshelfItem newItem = new BookshelfItem();
        newItem.setUser(userOpt.get());
        newItem.setBook(bookOpt.get());
        newItem.setStatus(status);
        
        bookshelfItemRepository.save(newItem);
        return ResponseEntity.ok("Book added to bookshelf with status: " + status);
    }

    // Endpoint to update the reading status of an existing book on the shelf
    @PutMapping("/{userId}/update/{bookId}")
    public ResponseEntity<String> updateBookStatus(@PathVariable Long userId, 
                                                   @PathVariable Long bookId, 
                                                   @RequestParam ReadingStatus newStatus) {
        
        Optional<BookshelfItem> itemOpt = bookshelfItemRepository.findByUserIdAndBookId(userId, bookId);
        
        if (itemOpt.isPresent()) {
            BookshelfItem item = itemOpt.get();
            item.setStatus(newStatus);
            bookshelfItemRepository.save(item);
            return ResponseEntity.ok("Book status updated to: " + newStatus);
        }
        
        return ResponseEntity.badRequest().body("Book not found on this user's bookshelf.");
    }
}