package com.mentecolmena.backend.controller;

import com.mentecolmena.backend.model.DashboardData;
import com.mentecolmena.backend.model.QuizResult;
import com.mentecolmena.backend.service.DashboardService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardData getDashboard() {
        return dashboardService.getDashboard();
    }

    @PostMapping("/session")
    public void recordSession(@RequestBody Map<String, String> payload) {
        String date = payload.getOrDefault("date", LocalDate.now().toString());
        dashboardService.recordSessionDay(date);
    }

    @PostMapping("/quiz")
    public QuizResult saveQuiz(@RequestBody QuizResult quizResult) {
        return dashboardService.saveQuizResult(quizResult);
    }
}
