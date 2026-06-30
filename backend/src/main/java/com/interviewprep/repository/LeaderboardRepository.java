package com.interviewprep.repository;

import com.interviewprep.model.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface LeaderboardRepository extends JpaRepository<LeaderboardEntry, Long> {
    Optional<LeaderboardEntry> findByUserId(Long userId);

    @Query("SELECT e FROM LeaderboardEntry e ORDER BY e.totalScore DESC")
    List<LeaderboardEntry> findTop50ByOrderByTotalScoreDesc(org.springframework.data.domain.Pageable pageable);

    @Query("SELECT COUNT(e) + 1 FROM LeaderboardEntry e WHERE e.totalScore > (SELECT l.totalScore FROM LeaderboardEntry l WHERE l.user.id = :userId)")
    Long findRankByUserId(Long userId);
}
