package com.interviewprep.service;

import com.interviewprep.dto.CodingSubmissionDTO;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.model.*;
import com.interviewprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CodingChallengeService {

    private final CodingChallengeRepository challengeRepository;
    private final CodingSubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final AIFeedbackService aiService;
    private final LeaderboardService leaderboardService;

    public List<CodingChallenge> getChallenges(String difficulty, String topic) {
        boolean hasDifficulty = difficulty != null && !difficulty.isBlank();
        boolean hasTopic = topic != null && !topic.isBlank();

        if (hasDifficulty && hasTopic) {
            return challengeRepository.findByDifficultyAndTopic(
                    CodingChallenge.Difficulty.valueOf(difficulty.toUpperCase()), topic);
        } else if (hasDifficulty) {
            return challengeRepository.findByDifficulty(
                    CodingChallenge.Difficulty.valueOf(difficulty.toUpperCase()));
        } else if (hasTopic) {
            return challengeRepository.findByTopic(topic);
        }
        return challengeRepository.findAll();
    }

    public CodingChallenge getChallenge(Long id) {
        return challengeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found: " + id));
    }

    public CodingSubmission submitCode(Long challengeId, String userEmail, CodingSubmissionDTO dto) {
        CodingChallenge challenge = getChallenge(challengeId);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Use AI to judge code
        String aiPrompt = String.format("""
            Given this coding challenge: %s
            Description: %s
            And this submitted %s code:
            %s
            Test cases: %s
            Does this code correctly solve the problem? Test it mentally against the test cases.
            Respond ONLY with JSON: {"status": "ACCEPTED" or "WRONG_ANSWER", "explanation": "..."}
            """,
            challenge.getTitle(), challenge.getDescription(),
            dto.getLanguage(), dto.getCode(), challenge.getTestCasesJson());

        String aiResponse = aiService.callGeminiRaw(aiPrompt);
        CodingSubmission.Status status = CodingSubmission.Status.WRONG_ANSWER;
        String explanation = aiResponse;

        try {
            // Extract JSON from AI response
            int jsonStart = aiResponse.indexOf('{');
            int jsonEnd = aiResponse.lastIndexOf('}') + 1;
            if (jsonStart >= 0 && jsonEnd > jsonStart) {
                String jsonStr = aiResponse.substring(jsonStart, jsonEnd);
                com.fasterxml.jackson.databind.JsonNode node =
                        new com.fasterxml.jackson.databind.ObjectMapper().readTree(jsonStr);
                String statusStr = node.path("status").asText("WRONG_ANSWER");
                explanation = node.path("explanation").asText(aiResponse);
                status = statusStr.contains("ACCEPTED") ?
                        CodingSubmission.Status.ACCEPTED : CodingSubmission.Status.WRONG_ANSWER;
            }
        } catch (Exception ignored) {}

        CodingSubmission submission = CodingSubmission.builder()
                .user(user).challenge(challenge)
                .code(dto.getCode()).language(dto.getLanguage() != null ? dto.getLanguage() : "java")
                .status(status).explanation(explanation)
                .build();
        submission = submissionRepository.save(submission);

        if (status == CodingSubmission.Status.ACCEPTED) {
            leaderboardService.updateLeaderboard(user, 0, 1);
        }
        return submission;
    }

    public List<CodingSubmission> getUserSubmissions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return submissionRepository.findByUserIdOrderBySubmittedAtDesc(user.getId());
    }

    public String runCode(Long id, String code, String language, String customInput) {
        CodingChallenge challenge = getChallenge(id);
        String prompt = String.format("""
            You are a remote compiler and execution sandbox. For the following coding problem:
            Title: %s
            Description: %s
            
            Evaluate this %s code:
            %s
            
            Run the code locally (mentally) against the following custom input parameter:
            %s
            
            Output strictly the result of compiling/running this code (i.e. standard output print statements or return values). 
            If the code has logical or compile errors, display the stack trace or compilation error clearly. Do not wrap in markdown or JSON, output exactly what the program console stdout would show.
            """,
            challenge.getTitle(), challenge.getDescription(),
            language, code, customInput);

        return aiService.callGeminiRaw(prompt);
    }
}
