package com.mentecolmena.backend.controller;

import com.mentecolmena.backend.model.Goal;
import com.mentecolmena.backend.repository.GoalRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/goals")
public class GoalController {
    private final GoalRepository goalRepository;

    public GoalController(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    @GetMapping
    public List<Goal> getGoals() {
        List<Goal> goals = goalRepository.findAll();
        if (goals.isEmpty()) {
            // Seed defaults
            Goal seed1 = new Goal("Study Sessions", 0, 7, "#2563EB", false);
            Goal seed2 = new Goal("Quizzes Taken", 0, 5, "#10B981", false);
            Goal seed3 = new Goal("Notes Reviewed", 0, 15, "#8B5CF6", false);
            goalRepository.save(seed1);
            goalRepository.save(seed2);
            goalRepository.save(seed3);
            goals = goalRepository.findAll();
        }
        return goals;
    }

    @PostMapping
    public Goal createGoal(@RequestBody Goal goal) {
        return goalRepository.save(goal);
    }

    @PutMapping("/{id}")
    public boolean updateGoal(@PathVariable String id, @RequestBody Goal newGoal) {
        Optional<Goal> op = goalRepository.findById(id);
        if (op.isPresent()) {
            Goal g = op.get();
            g.setLabel(newGoal.getLabel());
            g.setGoal(newGoal.getGoal());
            g.setManualDone(newGoal.getManualDone());
            g.setColor(newGoal.getColor());
            g.setCustom(newGoal.isCustom());
            goalRepository.save(g);
            return true;
        }
        return false;
    }

    @DeleteMapping("/{id}")
    public boolean deleteGoal(@PathVariable String id) {
        if (goalRepository.existsById(id)) {
            goalRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
