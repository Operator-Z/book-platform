package com.bookplatform.library.repository;

import com.bookplatform.library.entity.BookshelfItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookshelfItemRepository extends JpaRepository<BookshelfItem, Long> {
    Optional<BookshelfItem> findByUserIdAndBookId(Long userId, Long bookId);
}
