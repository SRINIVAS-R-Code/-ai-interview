package com.interviewprep.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mock_test_questions")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class MockTestQuestion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private MockTest test;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "option_a", length = 300)
    private String optionA;

    @Column(name = "option_b", length = 300)
    private String optionB;

    @Column(name = "option_c", length = 300)
    private String optionC;

    @Column(name = "option_d", length = 300)
    private String optionD;

    @Column(name = "correct_option", nullable = false, length = 1)
    private String correctOption;
}
