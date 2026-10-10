package com.bookplatform.library.controller;

import com.bookplatform.library.entity.*;
import com.bookplatform.library.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Configuration
public class FrontendBridgeController {

    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookshelfItemRepository bookshelfItemRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private BookListRepository bookListRepository;
    @Autowired
    private BookClubRepository bookClubRepository;
    @Autowired
    private BuddyReadRoomRepository buddyReadRoomRepository;

    // 1. Create a default User (ID = 1) on startup so the UI works immediately
    @PostConstruct
    public void seedDefaultUser() {
        if (userRepository.count() == 0) {
            User defaultUser = new User();
            defaultUser.setUsername("EverydayReader");
            userRepository.save(defaultUser);
            System.out.println("Seeded default user: EverydayReader (ID: 1)");
        }
    }

    // 2. Enable CORS globally so Angular (port 4200) can call Spring Boot (port 8080)
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }

    // 3. GET endpoints for the Angular UI
    @GetMapping("/books")
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @GetMapping("/bookshelf/{userId}")
    public List<BookshelfItem> getUserBookshelf(@PathVariable Long userId) {
        return bookshelfItemRepository.findAll().stream()
                .filter(item -> item.getUser() != null && item.getUser().getId().equals(userId))
                .toList();
    }

    @GetMapping("/reviews/book/{bookId}")
    public List<Review> getBookReviews(@PathVariable Long bookId) {
        return reviewRepository.findByBookId(bookId);
    }

    @GetMapping("/booklists")
    public List<BookList> getAllBookLists() {
        return bookListRepository.findAll();
    }

    @GetMapping("/community/clubs")
    public List<BookClub> getAllClubs() {
        return bookClubRepository.findAll();
    }

    @GetMapping("/community/buddyrooms")
    public List<BuddyReadRoom> getAllBuddyRooms() {
        return buddyReadRoomRepository.findAll();
    }
}