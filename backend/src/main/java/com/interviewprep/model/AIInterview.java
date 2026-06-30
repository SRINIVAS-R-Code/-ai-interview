package com.interviewprep.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_interviews")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AIInterview {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status;

    @Column(name = "messages_json", columnDefinition = "TEXT")
    private String messagesJson;

    @Column(name = "overall_feedback", columnDefinition = "TEXT")
    private String overallFeedback;

    private Integer score;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public enum Status { IN_PROGRESS, COMPLETED }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = Status.IN_PROGRESS;
        }
    }
}
