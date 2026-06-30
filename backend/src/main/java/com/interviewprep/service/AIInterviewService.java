package com.interviewprep.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.model.AIInterview;
import com.interviewprep.model.User;
import com.interviewprep.repository.AIInterviewRepository;
import com.interviewprep.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AIInterviewService {

    private final AIInterviewRepository interviewRepository;
    private final UserRepository userRepository;
    private final AIFeedbackService aiService;
    private final ObjectMapper objectMapper;

    public AIInterview startInterview(String email, String role) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String prompt = String.format("""
                You are a senior technical interviewer conducting a mock interview for the role: %s.
                Please ask the candidate their first challenging technical or behavioral question.
                Keep it concise (1-2 sentences). Do not include any greeting or conversational filler like "Let's start", "Welcome", etc.
                """, role);

        String firstQuestion = aiService.callGeminiRaw(prompt);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("sender", "AI", "text", firstQuestion));

        AIInterview interview = AIInterview.builder()
                .user(user)
                .role(role)
                .status(AIInterview.Status.IN_PROGRESS)
                .messagesJson(serializeMessages(messages))
                .createdAt(LocalDateTime.now())
                .build();

        return interviewRepository.save(interview);
    }

    public AIInterview respondToInterview(Long id, String email, String userMessage) {
        AIInterview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found: " + id));

        if (!interview.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("Unauthorized access to this interview session");
        }

        if (interview.getStatus() == AIInterview.Status.COMPLETED) {
            return interview;
        }

        List<Map<String, String>> messages = deserializeMessages(interview.getMessagesJson());
        messages.add(Map.of("sender", "USER", "text", userMessage));

        // Count user responses
        long userResponseCount = messages.stream().filter(m -> "USER".equals(m.get("sender"))).count();

        if (userResponseCount < 5) {
            // Ask next question
            String historyStr = buildHistoryString(messages);
            String prompt = String.format("""
                    You are a senior technical interviewer conducting a mock interview for the role: %s.
                    Here is the chat transcript so far:
                    %s
                    
                    Please ask the next follow-up question. You can follow up on their previous answer or transition to a new relevant topic.
                    Keep it concise (1-2 sentences). Do not include greetings or filler.
                    """, interview.getRole(), historyStr);

            String nextQuestion = aiService.callGeminiRaw(prompt);
            messages.add(Map.of("sender", "AI", "text", nextQuestion));
            interview.setMessagesJson(serializeMessages(messages));
        } else {
            // Complete and grade
            interview.setStatus(AIInterview.Status.COMPLETED);
            String historyStr = buildHistoryString(messages);
            String prompt = String.format("""
                    You are an expert technical interviewer. You have just completed a simulated mock interview for the role of %s.
                    Here is the complete chat transcript:
                    %s
                    
                    Please evaluate the candidate's performance.
                    Format the response strictly as a JSON object with the following keys (do not wrap in markdown code blocks like ```json, return raw JSON):
                    {
                      "score": (integer between 0 and 100),
                      "verdict": "A brief overall evaluation of their level (1-2 sentences)",
                      "strengths": ["strength 1", "strength 2", "strength 3"],
                      "improvements": ["improvement 1", "improvement 2", "improvement 3"],
                      "modelAnswers": [
                         {
                            "question": "Question 1",
                            "idealAnswer": "Comprehensive ideal answer details"
                         },
                         {
                            "question": "Question 2",
                            "idealAnswer": "Comprehensive ideal answer details"
                         },
                         {
                            "question": "Question 3",
                            "idealAnswer": "Comprehensive ideal answer details"
                         },
                         {
                            "question": "Question 4",
                            "idealAnswer": "Comprehensive ideal answer details"
                         },
                         {
                            "question": "Question 5",
                            "idealAnswer": "Comprehensive ideal answer details"
                         }
                      ]
                    }
                    """, interview.getRole(), historyStr);

            String feedbackJson = aiService.callGeminiRaw(prompt);
            interview.setOverallFeedback(feedbackJson);

            // Extract score
            int score = 75; // fallback
            try {
                Map<String, Object> map = objectMapper.readValue(feedbackJson, new TypeReference<Map<String, Object>>() {});
                if (map.containsKey("score")) {
                    score = ((Number) map.get("score")).intValue();
                }
            } catch (Exception e) {
                // Parse failed, try regex
                java.util.regex.Pattern p = java.util.regex.Pattern.compile("\"score\"\\s*:\\s*(\\d+)");
                java.util.regex.Matcher m = p.matcher(feedbackJson);
                if (m.find()) {
                    score = Integer.parseInt(m.group(1));
                }
            }
            interview.setScore(score);
            interview.setMessagesJson(serializeMessages(messages));
        }

        return interviewRepository.save(interview);
    }

    public List<AIInterview> getMyInterviews(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return interviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public AIInterview getInterviewById(Long id, String email) {
        AIInterview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found: " + id));
        if (!interview.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("Unauthorized access to this interview session");
        }
        return interview;
    }

    private String buildHistoryString(List<Map<String, String>> messages) {
        StringBuilder sb = new StringBuilder();
        for (Map<String, String> m : messages) {
            sb.append(m.get("sender")).append(": ").append(m.get("text")).append("\n\n");
        }
        return sb.toString();
    }

    private String serializeMessages(List<Map<String, String>> messages) {
        try {
            return objectMapper.writeValueAsString(messages);
        } catch (IOException e) {
            return "[]";
        }
    }

    private List<Map<String, String>> deserializeMessages(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<Map<String, String>>>() {});
        } catch (IOException e) {
            return new ArrayList<>();
        }
    }
}
