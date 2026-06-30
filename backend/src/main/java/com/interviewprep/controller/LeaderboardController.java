package com.interviewprep.controller;

import com.interviewprep.model.LeaderboardEntry;
import com.interviewprep.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping
    public ResponseEntity<List<LeaderboardEntry>> getLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getTop50());
    }

    @GetMapping("/my-rank")
    public ResponseEntity<Map<String, Object>> getMyRank(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(leaderboardService.getMyRank(userDetails.getUsername()));
    }
}
