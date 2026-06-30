package com.interviewprep.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leaderboard")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class LeaderboardEntry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(name = "user_name", length = 100)
    private String userName;

    @Column(name = "total_score")
    @Builder.Default
    private Integer totalScore = 0;

    @Column(name = "tests_taken")
    @Builder.Default
    private Integer testsTaken = 0;

    @Column(name = "challenges_solved")
    @Builder.Default
    private Integer challengesSolved = 0;

    @Column(name = "last_updated")
    @Builder.Default
    private LocalDateTime lastUpdated = LocalDateTime.now();
}
