package com.interviewprep.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "coding_challenges")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CodingChallenge {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Column(name = "sample_input", columnDefinition = "TEXT")
    private String sampleInput;

    @Column(name = "sample_output", columnDefinition = "TEXT")
    private String sampleOutput;

    @Column(name = "test_cases_json", columnDefinition = "TEXT")
    private String testCasesJson;

    @Column(length = 100)
    private String topic;

    public enum Difficulty { EASY, MEDIUM, HARD }
}
