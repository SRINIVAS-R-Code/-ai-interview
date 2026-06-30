package com.interviewprep.service;

import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.model.*;
import com.interviewprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.Map;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final LeaderboardRepository leaderboardRepository;
    private final UserRepository userRepository;

    public void updateLeaderboard(User user, int scoreIncrement, int challengesSolvedIncrement) {
        Optional<LeaderboardEntry> existing = leaderboardRepository.findByUserId(user.getId());
        LeaderboardEntry entry;
        if (existing.isPresent()) {
            entry = existing.get();
            entry.setTotalScore(entry.getTotalScore() + scoreIncrement);
            if (scoreIncrement > 0) entry.setTestsTaken(entry.getTestsTaken() + 1);
            entry.setChallengesSolved(entry.getChallengesSolved() + challengesSolvedIncrement);
        } else {
            entry = LeaderboardEntry.builder()
                    .user(user).userName(user.getName())
                    .totalScore(scoreIncrement).testsTaken(scoreIncrement > 0 ? 1 : 0)
                    .challengesSolved(challengesSolvedIncrement)
                    .build();
        }
        leaderboardRepository.save(entry);
    }

    public List<LeaderboardEntry> getTop50() {
        return leaderboardRepository.findTop50ByOrderByTotalScoreDesc(PageRequest.of(0, 50));
    }

    public Map<String, Object> getMyRank(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Optional<LeaderboardEntry> entry = leaderboardRepository.findByUserId(user.getId());
        Long rank = leaderboardRepository.findRankByUserId(user.getId());
        return java.util.Map.of(
                "rank", rank != null ? rank : 0L,
                "entry", entry.orElse(LeaderboardEntry.builder()
                        .user(user).userName(user.getName())
                        .totalScore(0).testsTaken(0).challengesSolved(0).build())
        );
    }
}
