package com.mentecolmena.backend.controller;

import com.mentecolmena.backend.model.Goal;
import com.mentecolmena.backend.service.GoalService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/goals")
public class GoalController {
    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public List<Goal> getGoals() {
        return goalService.getGoals();
    }

    @PostMapping
    public Goal createGoal(@RequestBody Goal goal) {
        return goalService.saveGoal(goal);
    }

    @PutMapping("/{id}")
    public boolean updateGoal(@PathVariable String id, @RequestBody Goal newGoal) {
        return goalService.updateGoal(id, newGoal);
    }

    @DeleteMapping("/{id}")
    public boolean deleteGoal(@PathVariable String id) {
        return goalService.deleteGoal(id);
    }
}
