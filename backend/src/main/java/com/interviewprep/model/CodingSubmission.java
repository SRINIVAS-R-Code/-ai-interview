package com.interviewprep.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "coding_submissions")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CodingSubmission {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private CodingChallenge challenge;

    // Transient fields to expose challenge info without lazy load issues
    @jakarta.persistence.Transient
    public Long getChallengeId() { return challenge != null ? challenge.getId() : null; }
    @jakarta.persistence.Transient
    public String getChallengeTitle() { return challenge != null ? challenge.getTitle() : null; }

    @Column(nullable = false, columnDefinition = "TEXT")
    private String code;

    @Column(length = 50)
    @Builder.Default
    private String language = "java";

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.WRONG_ANSWER;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "submitted_at")
    @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now();

    public enum Status { ACCEPTED, WRONG_ANSWER, RUNTIME_ERROR, TLE }
}
