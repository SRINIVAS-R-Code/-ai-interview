package com.interviewprep.dto;

import lombok.Data;

@Data
public class FeedbackRequestDTO {
    private String contextType;   // MOCK_TEST, CODING, APTITUDE, RESUME
    private Long contextId;
    private String performanceSummary;
}
