package com.interviewprep.repository;

import com.interviewprep.model.AIFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AIFeedbackRepository extends JpaRepository<AIFeedback, Long> {
    List<AIFeedback> findByUserIdOrderByGeneratedAtDesc(Long userId);
}
