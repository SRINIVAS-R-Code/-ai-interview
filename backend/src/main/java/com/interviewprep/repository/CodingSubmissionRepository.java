package com.interviewprep.repository;

import com.interviewprep.model.CodingSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CodingSubmissionRepository extends JpaRepository<CodingSubmission, Long> {
    List<CodingSubmission> findByUserIdOrderBySubmittedAtDesc(Long userId);
    long countByUserIdAndStatus(Long userId, CodingSubmission.Status status);
}
