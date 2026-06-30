package com.interviewprep.service;

import com.interviewprep.dto.FeedbackRequestDTO;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.model.*;
import com.interviewprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AIFeedbackService {

    private final AIFeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    public String callGeminiRaw(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", prompt)))
                    )
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            String url = geminiApiUrl + "?key=" + geminiApiKey;

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List candidates = (List) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map candidate = (Map) candidates.get(0);
                    Map content = (Map) candidate.get("content");
                    List parts = (List) content.get("parts");
                    Map part = (Map) parts.get(0);
                    return (String) part.get("text");
                }
            }
        } catch (Exception e) {
            String msg = e.getMessage();
            if (msg != null && (msg.contains("429") || msg.contains("RESOURCE_EXHAUSTED") || msg.contains("quota"))) {
                return "⚠️ Gemini AI Free Tier Rate Limit Exceeded (429 Too Many Requests).\n\nThe platform is currently using a free tier API key which limits requests to 20 calls/minute. Please wait a few seconds and try again.";
            }
            return "AI feedback temporarily unavailable: " + e.getMessage();
        }
        return "No feedback generated.";
    }

    public AIFeedback generateFeedback(String userEmail, FeedbackRequestDTO dto) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Default contextType to MOCK_TEST if not provided
        if (dto.getContextType() == null || dto.getContextType().isBlank()) {
            dto.setContextType("MOCK_TEST");
        }
        // Default performanceSummary to avoid NPE in prompts
        if (dto.getPerformanceSummary() == null) {
            dto.setPerformanceSummary("No summary provided.");
        }

        String prompt = buildPrompt(dto);
        String feedbackText = callGeminiRaw(prompt);

        AIFeedback.ContextType ctxType;
        try {
            ctxType = AIFeedback.ContextType.valueOf(dto.getContextType().toUpperCase());
        } catch (IllegalArgumentException e) {
            ctxType = AIFeedback.ContextType.MOCK_TEST;
        }

        AIFeedback feedback = AIFeedback.builder()
                .user(user)
                .contextType(ctxType)
                .contextId(dto.getContextId())
                .feedbackText(feedbackText)
                .recommendations("See feedback above for recommendations.")
                .build();
        return feedbackRepository.save(feedback);
    }

    private String buildPrompt(FeedbackRequestDTO dto) {
        String summary = dto.getPerformanceSummary() != null ? dto.getPerformanceSummary() : "No summary provided.";
        return switch (dto.getContextType().toUpperCase()) {
            case "MOCK_TEST" -> String.format("""
                You are a senior software engineer and interview coach.
                A candidate just completed a mock test and their performance summary is:
                %s
                
                Provide concise, actionable feedback:
                1. Overall performance assessment (2-3 sentences)
                2. Topics they're strong in (list)
                3. Topics to improve (list)
                4. 3 specific study recommendations
                5. Motivational closing line
                 """, summary);
            case "CODING" -> String.format("""
                You are a software engineering mentor.
                A candidate submitted a coding solution. Summary: %s
                
                Provide:
                1. Code quality assessment
                2. Algorithmic approach evaluation
                3. Suggestions for optimization
                4. Best practices to follow
                """, summary);
            case "APTITUDE" -> String.format("""
                You are an aptitude trainer.
                A candidate completed an aptitude test. Summary: %s
                
                Provide:
                1. Performance analysis by category
                2. Weak areas and improvement strategy
                3. Recommended practice resources
                4. Daily practice tip
                """, summary);
            default -> "Provide constructive feedback for: " + summary;
        };
    }

    public List<AIFeedback> getUserFeedback(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return feedbackRepository.findByUserIdOrderByGeneratedAtDesc(user.getId());
    }

    public String generateHint(Map<String, String> requestData) {
        String context = requestData.getOrDefault("context", "MOCK_TEST");
        String question = requestData.getOrDefault("questionText", "");
        String details = requestData.getOrDefault("details", "");

        String prompt;
        if ("CODING".equalsIgnoreCase(context)) {
            prompt = String.format("""
                You are an interview co-pilot. The student is working on a coding challenge.
                Challenge description: %s
                Current Code: %s
                Provide a subtle, helpful hint or algorithm suggestion without giving away the complete solution or code. Keep it brief (2-3 sentences).
                """, question, details);
        } else {
            prompt = String.format("""
                You are an interview co-pilot helping a student with a test.
                Question: %s
                Options: %s
                Provide a helpful hint, concept explanation, or suggestion to guide them to the right option. DO NOT explicitly name the correct option. Keep it concise (1-2 sentences).
                """, question, details);
        }

        return callGeminiRaw(prompt);
    }

    public String generateIdealSolution(String title, String description, String language) {
        String prompt = String.format("""
            You are an expert algorithms instructor. For the following coding problem, generate the most optimal solution in %s with clear comments, followed by a brief complexity analysis (Time Complexity and Space Complexity).
            
            Problem Title: %s
            Problem Description: %s
            
            Return the solution as clean, properly formatted markdown, with the code inside standard markdown code blocks (e.g. ```%s). Do not include any HTML tags.
            """, 
            language.toUpperCase(), 
            title, 
            description, 
            language.toLowerCase());
        return callGeminiRaw(prompt);
    }

    public AIFeedback getFeedbackById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found: " + id));
    }
}
