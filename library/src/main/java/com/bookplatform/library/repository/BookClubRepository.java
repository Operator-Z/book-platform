package com.bookplatform.library.repository;

import com.bookplatform.library.entity.BookClub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookClubRepository extends JpaRepository<BookClub, Long> {
}