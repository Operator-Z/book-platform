package com.bookplatform.library.repository;

import com.bookplatform.library.entity.BuddyReadRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuddyReadRoomRepository extends JpaRepository<BuddyReadRoom, Long> {
}