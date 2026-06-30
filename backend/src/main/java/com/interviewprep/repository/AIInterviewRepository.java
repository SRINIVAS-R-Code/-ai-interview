package com.interviewprep.repository;

import com.interviewprep.model.AIInterview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AIInterviewRepository extends JpaRepository<AIInterview, Long> {
    List<AIInterview> findByUserIdOrderByCreatedAtDesc(Long userId);
}
