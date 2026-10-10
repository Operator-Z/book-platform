package com.bookplatform.library.controller;

import com.bookplatform.library.entity.Book;
import com.bookplatform.library.entity.BookClub;
import com.bookplatform.library.entity.BuddyReadRoom;
import com.bookplatform.library.entity.User;
import com.bookplatform.library.repository.BookClubRepository;
import com.bookplatform.library.repository.BookRepository;
import com.bookplatform.library.repository.BuddyReadRoomRepository;
import com.bookplatform.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/community")
public class CommunityController {

    @Autowired
    private BookClubRepository bookClubRepository;
    @Autowired
    private BuddyReadRoomRepository buddyReadRoomRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;

    @PostMapping("/club/create")
    public ResponseEntity<String> createClub(@RequestParam String name, @RequestParam String description) {
        BookClub club = new BookClub();
        club.setName(name);
        club.setDescription(description);
        bookClubRepository.save(club);
        return ResponseEntity.ok("BookClub created successfully.");
    }

    @PostMapping("/buddyroom/create")
    public ResponseEntity<String> createBuddyRoom(@RequestParam String name, @RequestParam Long bookId) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isEmpty()) return ResponseEntity.badRequest().body("Book not found.");
        
        BuddyReadRoom room = new BuddyReadRoom();
        room.setName(name);
        room.setBook(bookOpt.get());
        buddyReadRoomRepository.save(room);
        return ResponseEntity.ok("Buddy Read Room created for book: " + bookOpt.get().getName());
    }

    @PostMapping("/club/{clubId}/join/{userId}")
    public ResponseEntity<String> joinClub(@PathVariable Long clubId, @PathVariable Long userId) {
        Optional<BookClub> clubOpt = bookClubRepository.findById(clubId);
        Optional<User> userOpt = userRepository.findById(userId);

        if (clubOpt.isPresent() && userOpt.isPresent()) {
            BookClub club = clubOpt.get();
            club.getMembers().add(userOpt.get());
            bookClubRepository.save(club);
            return ResponseEntity.ok("User joined BookClub.");
        }
        return ResponseEntity.badRequest().body("Club or User not found.");
    }
}