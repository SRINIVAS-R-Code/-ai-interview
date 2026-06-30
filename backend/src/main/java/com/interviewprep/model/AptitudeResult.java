package com.interviewprep.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "aptitude_results")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AptitudeResult {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AptitudeQuestion.Topic topic;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    private Integer total;

    @Column
    private Double percentage;

    @Column(name = "taken_at")
    @Builder.Default
    private LocalDateTime takenAt = LocalDateTime.now();
}
