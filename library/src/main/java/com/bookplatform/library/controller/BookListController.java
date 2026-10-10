package com.bookplatform.library.controller;

import com.bookplatform.library.entity.Book;
import com.bookplatform.library.entity.BookList;
import com.bookplatform.library.entity.User;
import com.bookplatform.library.repository.BookListRepository;
import com.bookplatform.library.repository.BookRepository;
import com.bookplatform.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/booklists")
public class BookListController {

    @Autowired
    private BookListRepository bookListRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;

    @PostMapping("/create")
    public ResponseEntity<String> createList(@RequestParam Long userId, @RequestParam String name) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("User not found.");

        BookList newList = new BookList();
        newList.setCreator(userOpt.get());
        newList.setName(name);
        bookListRepository.save(newList);
        
        return ResponseEntity.ok("BookList '" + name + "' created successfully.");
    }

    @PostMapping("/{listId}/addBook/{bookId}")
    public ResponseEntity<String> addBookToList(@PathVariable Long listId, @PathVariable Long bookId) {
        Optional<BookList> listOpt = bookListRepository.findById(listId);
        Optional<Book> bookOpt = bookRepository.findById(bookId);

        if (listOpt.isPresent() && bookOpt.isPresent()) {
            BookList list = listOpt.get();
            list.getBooks().add(bookOpt.get());
            bookListRepository.save(list);
            return ResponseEntity.ok("Book added to the list.");
        }
        return ResponseEntity.badRequest().body("List or Book not found.");
    }

    @PutMapping("/{listId}/upvote")
    public ResponseEntity<String> upvoteList(@PathVariable Long listId) {
        Optional<BookList> listOpt = bookListRepository.findById(listId);
        if (listOpt.isPresent()) {
            BookList list = listOpt.get();
            list.setUpvotes(list.getUpvotes() + 1);
            bookListRepository.save(list);
            return ResponseEntity.ok("List upvoted. Total upvotes: " + list.getUpvotes());
        }
        return ResponseEntity.badRequest().body("List not found.");
    }

    @PutMapping("/{listId}/downvote")
    public ResponseEntity<String> downvoteList(@PathVariable Long listId) {
        Optional<BookList> listOpt = bookListRepository.findById(listId);
        if (listOpt.isPresent()) {
            BookList list = listOpt.get();
            list.setDownvotes(list.getDownvotes() + 1);
            bookListRepository.save(list);
            return ResponseEntity.ok("List downvoted. Total downvotes: " + list.getDownvotes());
        }
        return ResponseEntity.badRequest().body("List not found.");
    }
}