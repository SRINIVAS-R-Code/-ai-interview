package com.interviewprep.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewprep.dto.TestSubmissionDTO;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.model.*;
import com.interviewprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MockTestService {

    private final MockTestRepository testRepository;
    private final MockTestQuestionRepository questionRepository;
    private final MockTestResultRepository resultRepository;
    private final UserRepository userRepository;
    private final LeaderboardService leaderboardService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<MockTest> getAllTests() {
        return testRepository.findAll();
    }

    public Map<String, Object> getTestWithQuestions(Long testId) {
        MockTest test = testRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found: " + testId));
        List<MockTestQuestion> questions = questionRepository.findTop50ByTestId(testId);
        return Map.of("test", test, "questions", questions);
    }

    public MockTestResult submitTest(Long testId, String userEmail, TestSubmissionDTO submission) {
        MockTest test = testRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found: " + testId));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<MockTestQuestion> questions = questionRepository.findTop50ByTestId(testId);

        int score = 0;
        for (MockTestQuestion q : questions) {
            String submitted = submission.getAnswers().get(String.valueOf(q.getId()));
            if (q.getCorrectOption().equalsIgnoreCase(submitted)) score++;
        }

        double percentage = (double) score / questions.size() * 100;
        String answersJson;
        try { answersJson = objectMapper.writeValueAsString(submission.getAnswers()); }
        catch (Exception e) { answersJson = "{}"; }

        MockTestResult result = MockTestResult.builder()
                .user(user).test(test)
                .score(score).totalMarks(questions.size())
                .percentage(percentage).answersJson(answersJson)
                .build();
        result = resultRepository.save(result);
        leaderboardService.updateLeaderboard(user, score, 0);
        return result;
    }

    public List<MockTestResult> getUserResults(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return resultRepository.findByUserIdOrderBySubmittedAtDesc(user.getId());
    }

    public MockTestResult getResultById(Long resultId) {
        return resultRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found: " + resultId));
    }
}
