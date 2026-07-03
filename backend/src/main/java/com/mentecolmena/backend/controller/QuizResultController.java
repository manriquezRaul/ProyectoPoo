package com.mentecolmena.backend.controller;

import com.mentecolmena.backend.model.QuizResult;
import com.mentecolmena.backend.service.QuizResultService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/quizzes")
public class QuizResultController {
    private final QuizResultService quizResultService;

    public QuizResultController(QuizResultService quizResultService) {
        this.quizResultService = quizResultService;
    }

    @GetMapping
    public List<QuizResult> getQuizzes() {
        return quizResultService.getQuizzesSortedByCreatedAtDesc();
    }

    @PostMapping
    public QuizResult saveQuiz(@RequestBody QuizResult quizResult) {
        return quizResultService.saveQuizResult(quizResult);
    }

    @DeleteMapping("/{id}")
    public boolean deleteQuiz(@PathVariable String id) {
        return quizResultService.deleteQuizResult(id);
    }
}
