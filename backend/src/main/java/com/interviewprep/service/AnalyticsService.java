package com.interviewprep.service;

import com.interviewprep.dto.AnalyticsSummaryDTO;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.model.*;
import com.interviewprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final MockTestResultRepository testResultRepository;
    private final CodingSubmissionRepository codingSubmissionRepository;
    private final AptitudeResultRepository aptitudeResultRepository;
    private final LeaderboardRepository leaderboardRepository;
    private final UserRepository userRepository;

    public AnalyticsSummaryDTO getSummary(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Long userId = user.getId();

        long totalTests = testResultRepository.countByUserId(userId);
        Double avgScore = testResultRepository.findAvgPercentageByUserId(userId);
        long challengesSolved = codingSubmissionRepository.countByUserIdAndStatus(userId, CodingSubmission.Status.ACCEPTED);
        Long rank = leaderboardRepository.findRankByUserId(userId);

        return AnalyticsSummaryDTO.builder()
                .totalTests(totalTests)
                .avgScore(avgScore != null ? avgScore : 0.0)
                .challengesSolved(challengesSolved)
                .rank(rank != null ? rank : 0L)
                .build();
    }

    public List<Map<String, Object>> getProgressData(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<MockTestResult> results = testResultRepository.findByUserIdOrderBySubmittedAtAsc(user.getId());

        return results.stream().map(r -> {
            Map<String, Object> point = new HashMap<>();
            point.put("date", r.getSubmittedAt().toLocalDate().toString());
            point.put("score", r.getPercentage());
            point.put("subject", r.getTest().getSubject());
            return point;
        }).collect(Collectors.toList());
    }

    public Map<String, Double> getSubjectBreakdown(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<MockTestResult> results = testResultRepository.findByUserIdOrderBySubmittedAtDesc(user.getId());

        Map<String, List<Double>> subjectScores = new HashMap<>();
        for (MockTestResult r : results) {
            String subject = r.getTest().getSubject();
            subjectScores.computeIfAbsent(subject, k -> new ArrayList<>()).add(r.getPercentage());
        }

        // Add aptitude scores
        for (AptitudeQuestion.Topic topic : AptitudeQuestion.Topic.values()) {
            Double avg = aptitudeResultRepository.findAvgPercentageByUserIdAndTopic(user.getId(), topic);
            if (avg != null) {
                subjectScores.computeIfAbsent(topic.name(), k -> new ArrayList<>()).add(avg);
            }
        }

        Map<String, Double> breakdown = new HashMap<>();
        for (Map.Entry<String, List<Double>> entry : subjectScores.entrySet()) {
            double avg = entry.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
            breakdown.put(entry.getKey(), Math.round(avg * 10.0) / 10.0);
        }
        return breakdown;
    }
}
