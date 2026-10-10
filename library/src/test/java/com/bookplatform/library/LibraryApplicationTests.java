package com.bookplatform.library;

import com.bookplatform.library.entity.Book;
import com.bookplatform.library.entity.BookList;
import com.bookplatform.library.entity.BookshelfItem;
import com.bookplatform.library.entity.ReadingStatus;
import com.bookplatform.library.entity.Review;
import com.bookplatform.library.entity.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class LibraryApplicationTests {

    @Test
    void testBookEntityAndCatalogMetadata() {
        Book book = new Book();
        book.setName("Dune");
        book.setAuthor("Frank Herbert");
        book.setIsbn("978-0441172719");

        Assertions.assertEquals("Dune", book.getName());
        Assertions.assertEquals("Frank Herbert", book.getAuthor());
        Assertions.assertEquals("978-0441172719", book.getIsbn());
    }

    @Test
    void testHalfPointRatingIncrementSystem() {
        Review validHalfStarReview = new Review();
        validHalfStarReview.setRating(4.5);
        validHalfStarReview.setContent("Great world-building!");

        double rating = validHalfStarReview.getRating();
        Assertions.assertTrue(rating >= 0.5 && rating <= 5.0);
        Assertions.assertEquals(0.0, (rating * 2) % 1.0);
    }

    @Test
    void testBookshelfStatusTransitions() {
        User user = new User();
        user.setUsername("EverydayReader");

        Book book = new Book();
        book.setName("1984");

        BookshelfItem item = new BookshelfItem();
        item.setUser(user);
        item.setBook(book);
        item.setStatus(ReadingStatus.TO_BE_READ);
        Assertions.assertEquals(ReadingStatus.TO_BE_READ, item.getStatus());

        item.setStatus(ReadingStatus.READ);
        Assertions.assertEquals(ReadingStatus.READ, item.getStatus());
    }

    @Test
    void testBookListCreation() {
        BookList list = new BookList();
        list.setName("Top50 parlies");
        Assertions.assertEquals("Top50 parlies", list.getName());
    }
}
