package com.interviewprep.config;

import com.interviewprep.model.AptitudeQuestion;
import com.interviewprep.repository.AptitudeQuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AptitudeDataSeeder implements CommandLineRunner {

    private final AptitudeQuestionRepository questionRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking Aptitude questions database status...");
        List<AptitudeQuestion> toSave = new ArrayList<>();

        for (AptitudeQuestion.Topic topic : AptitudeQuestion.Topic.values()) {
            for (AptitudeQuestion.Difficulty difficulty : AptitudeQuestion.Difficulty.values()) {
                long currentCount = questionRepository.countByTopicAndDifficulty(topic, difficulty);
                if (currentCount < 50) {
                    long needed = 50 - currentCount;
                    log.info("Seeding {} {} questions for topic {}", needed, difficulty, topic);
                    for (int i = 1; i <= needed; i++) {
                        int index = (int) (currentCount + i);
                        toSave.add(generateQuestion(topic, difficulty, index));
                    }
                }
            }
        }

        if (!toSave.isEmpty()) {
            questionRepository.saveAll(toSave);
            log.info("Successfully seeded {} new Aptitude questions into the database!", toSave.size());
        } else {
            log.info("Aptitude questions database already contains at least 50 questions for every topic and difficulty combination.");
        }
    }

    private AptitudeQuestion generateQuestion(AptitudeQuestion.Topic topic, AptitudeQuestion.Difficulty difficulty, int index) {
        String questionText = "";
        String optA = "";
        String optB = "";
        String optC = "";
        String optD = "";
        String correct = "A";
        String explanation = "";

        switch (topic) {
            case QUANTITATIVE:
                if (difficulty == AptitudeQuestion.Difficulty.EASY) {
                    int val1 = 10 * index;
                    int val2 = 5 * index;
                    questionText = "What is the sum of " + val1 + " and " + val2 + "?";
                    optA = String.valueOf(val1 + val2);
                    optB = String.valueOf(val1 + val2 + 5);
                    optC = String.valueOf(val1 + val2 - 10);
                    optD = String.valueOf(val1 * val2);
                    correct = "A";
                    explanation = "Simple addition: " + val1 + " + " + val2 + " = " + optA + ".";
                } else if (difficulty == AptitudeQuestion.Difficulty.MEDIUM) {
                    int base = 100 + index;
                    questionText = "If a value increases by 20% and then decreases by 10%, what is the net percentage change from " + base + "?";
                    optA = "8% increase";
                    optB = "10% increase";
                    optC = "12% increase";
                    optD = "15% increase";
                    correct = "A";
                    explanation = "Net change: (1 + 0.20) * (1 - 0.10) = 1.20 * 0.90 = 1.08, which is an 8% increase.";
                } else {
                    int p = 5000 + index * 100;
                    questionText = "Find the compound interest on $" + p + " at 10% per annum for 2 years (compounded annually).";
                    double interest = p * 0.21;
                    optA = "$" + String.format("%.2f", interest);
                    optB = "$" + String.format("%.2f", interest + 100);
                    optC = "$" + String.format("%.2f", interest - 50);
                    optD = "$" + String.format("%.2f", interest * 1.1);
                    correct = "A";
                    explanation = "Formula: A = P(1 + r/100)^n = " + p + "(1.1)^2 = " + p + "(1.21). CI = A - P = " + interest + ".";
                }
                break;

            case LOGICAL:
                if (difficulty == AptitudeQuestion.Difficulty.EASY) {
                    questionText = "Point to a photograph, John says: 'She is the mother of my sister's only brother.' How is the lady related to John? (Case #" + index + ")";
                    optA = "Mother";
                    optB = "Aunt";
                    optC = "Sister";
                    optD = "Grandmother";
                    correct = "A";
                    explanation = "My sister's only brother is John himself. The mother of John is John's mother.";
                } else if (difficulty == AptitudeQuestion.Difficulty.MEDIUM) {
                    int num = 3 * index;
                    questionText = "In a row of 60 students, Mary is positioned " + num + "th from the left. What is her position from the right?";
                    optA = String.valueOf(60 - num + 1);
                    optB = String.valueOf(60 - num);
                    optC = String.valueOf(60 - num - 1);
                    optD = String.valueOf(60 - num + 2);
                    correct = "A";
                    explanation = "Formula: Right position = Total - Left position + 1 = 60 - " + num + " + 1 = " + optA + ".";
                } else {
                    questionText = "If code for 'BUILDER' is 'VJKFGTD' (variation #" + index + "), what is the code for 'PROJECT'?";
                    optA = "RTOLEGV";
                    optB = "RTQLEGV";
                    optC = "RTQLFGV";
                    optD = "SUTLEGV";
                    correct = "B";
                    explanation = "Each letter is shifted forward by 2 positions in alphabetical order.";
                }
                break;

            case VERBAL:
                questionText = "Choose the synonym of 'Meticulous' (Context variation #" + index + ")";
                optA = "Careful and precise";
                optB = "Careless";
                optC = "Hasty";
                optD = "Lazy";
                correct = "A";
                explanation = "Meticulous means showing great attention to detail; very careful and precise.";
                break;

            case VERBAL_REASONING:
                questionText = "Statement: 'Company Y shares fell after news of key resignation.' Assumption: (I) Shareholders react to management changes. (II) Resignation was expected. (Case #" + index + ")";
                optA = "Only assumption I is implicit";
                optB = "Only assumption II is implicit";
                optC = "Both assumptions are implicit";
                optD = "Neither is implicit";
                correct = "A";
                explanation = "Share price falls show that shareholders react to executive management transitions (I is implicit). II is not supported by the drop.";
                break;

            case NON_VERBAL_REASONING:
                questionText = "Which shape completes the pattern description for a standard matrix rotation (rotation sequence #" + index + ")?";
                optA = "90 degree clockwise rotated circle";
                optB = "Mirror image of triangle";
                optC = "Vertical inversion of square";
                optD = "None of these";
                correct = "A";
                explanation = "The pattern rules require rotating each element clockwise by 90 degrees in each step.";
                break;

            case DATA_INTERPRETATION:
                int baseValue = 400 + index * 10;
                questionText = "A table lists product sales: Q1=" + baseValue + ", Q2=" + (baseValue + 50) + ", Q3=" + (baseValue + 100) + ". Find the percentage contribution of Q2 sales to total sales.";
                double total = baseValue + (baseValue + 50) + (baseValue + 100);
                double share = ((baseValue + 50) / total) * 100;
                optA = String.format("%.1f", share) + "%";
                optB = String.format("%.1f", share + 5) + "%";
                optC = String.format("%.1f", share - 3) + "%";
                optD = "50%";
                correct = "A";
                explanation = "Total sales = " + total + ". Q2 sales = " + (baseValue + 50) + ". Share = " + share + "%.";
                break;

            case DATA_SUFFICIENCY:
                questionText = "What is the value of X? Statement (1): X + Y = " + (20 + index) + ". Statement (2): Y = 5. (Sufficiency case #" + index + ")";
                optA = "Both statements together are sufficient, but neither alone";
                optB = "Statement 1 alone is sufficient";
                optC = "Statement 2 alone is sufficient";
                optD = "Statements together are not sufficient";
                correct = "A";
                explanation = "To solve for X, we need the values of both equations. Both statements together are sufficient.";
                break;
        }

        return AptitudeQuestion.builder()
                .topic(topic)
                .questionText(questionText)
                .optionA(optA)
                .optionB(optB)
                .optionC(optC)
                .optionD(optD)
                .correctOption(correct)
                .difficulty(difficulty)
                .explanation(explanation)
                .build();
    }
}
