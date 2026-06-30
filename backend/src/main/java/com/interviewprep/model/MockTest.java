package com.interviewprep.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mock_tests")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class MockTest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 100)
    private String subject;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Column(name = "duration_minutes")
    @Builder.Default
    private Integer durationMinutes = 30;

    @Column(name = "total_questions")
    @Builder.Default
    private Integer totalQuestions = 10;

    public enum Difficulty { EASY, MEDIUM, HARD }
}
