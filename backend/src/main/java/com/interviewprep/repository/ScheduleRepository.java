package com.interviewprep.repository;

import com.interviewprep.model.InterviewSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<InterviewSchedule, Long> {
    List<InterviewSchedule> findByUserIdOrderByInterviewDateAsc(Long userId);
    List<InterviewSchedule> findByUserIdAndInterviewDateGreaterThanEqualOrderByInterviewDateAsc(Long userId, LocalDate date);
}
