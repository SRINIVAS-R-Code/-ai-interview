package com.interviewprep.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data @Builder
public class AnalyticsSummaryDTO {
    private long totalTests;
    private double avgScore;
    private long challengesSolved;
    private long rank;
    private List<Map<String, Object>> progressData;
    private Map<String, Double> subjectBreakdown;
}
