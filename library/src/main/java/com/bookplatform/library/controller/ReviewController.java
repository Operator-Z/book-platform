package com.bookplatform.library.controller;

import com.bookplatform.library.entity.Book;
import com.bookplatform.library.entity.Review;
import com.bookplatform.library.entity.User;
import com.bookplatform.library.repository.BookRepository;
import com.bookplatform.library.repository.ReviewRepository;
import com.bookplatform.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;

    @PostMapping("/add")
    public ResponseEntity<String> addReview(@RequestParam Long userId, 
                                            @RequestParam Long bookId, 
                                            @RequestParam Double rating, 
                                            @RequestParam String content) {
                                                
        // Logic for 5-point system with strict 0.5 differentiation
        if (rating == null || rating < 0.0 || rating > 5.0 || rating % 0.5 != 0) {
            return ResponseEntity.badRequest().body("Invalid rating. Must be between 0 and 5, using 0.5 increments.");
        }

        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Book> bookOpt = bookRepository.findById(bookId);

        if (userOpt.isEmpty() || bookOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User or Book not found.");
        }

        Review review = new Review();
        review.setUser(userOpt.get());
        review.setBook(bookOpt.get());
        review.setRating(rating);
        review.setContent(content);
        
        reviewRepository.save(review);
        return ResponseEntity.ok("Review and rating posted successfully.");
    }

    @GetMapping("/book/{bookId}/average")
    public ResponseEntity<String> getAverageRating(@PathVariable Long bookId) {
        Double avgRating = reviewRepository.getAverageRatingForBook(bookId);
        if (avgRating == null) {
            return ResponseEntity.ok("No reviews yet. Rating: 0.0");
        }
        return ResponseEntity.ok("Averaged Rating: " + String.format("%.2f", avgRating) + "/5.0");
    }
}