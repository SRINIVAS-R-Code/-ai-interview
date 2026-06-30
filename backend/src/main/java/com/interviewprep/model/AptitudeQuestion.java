package com.interviewprep.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "aptitude_questions")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AptitudeQuestion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Topic topic;

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

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Difficulty difficulty = Difficulty.MEDIUM;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    public enum Topic { QUANTITATIVE, LOGICAL, VERBAL, VERBAL_REASONING, NON_VERBAL_REASONING, DATA_INTERPRETATION, DATA_SUFFICIENCY }
    public enum Difficulty { EASY, MEDIUM, HARD }
}
