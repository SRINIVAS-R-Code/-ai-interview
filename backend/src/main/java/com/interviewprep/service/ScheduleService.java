package com.interviewprep.service;

import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.model.*;
import com.interviewprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    public List<InterviewSchedule> getMySchedules(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return scheduleRepository.findByUserIdOrderByInterviewDateAsc(user.getId());
    }

    public InterviewSchedule getUpcoming(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<InterviewSchedule> upcoming = scheduleRepository
                .findByUserIdAndInterviewDateGreaterThanEqualOrderByInterviewDateAsc(user.getId(), LocalDate.now());
        return upcoming.isEmpty() ? null : upcoming.get(0);
    }

    public InterviewSchedule createSchedule(String userEmail, InterviewSchedule schedule) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        schedule.setUser(user);
        return scheduleRepository.save(schedule);
    }

    public InterviewSchedule updateSchedule(Long id, String userEmail, InterviewSchedule updated) {
        InterviewSchedule existing = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found: " + id));
        existing.setTitle(updated.getTitle());
        existing.setCompany(updated.getCompany());
        existing.setInterviewDate(updated.getInterviewDate());
        existing.setInterviewTime(updated.getInterviewTime());
        existing.setNotes(updated.getNotes());
        return scheduleRepository.save(existing);
    }

    public void deleteSchedule(Long id) {
        if (!scheduleRepository.existsById(id))
            throw new ResourceNotFoundException("Schedule not found: " + id);
        scheduleRepository.deleteById(id);
    }
}
