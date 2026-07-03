package com.mentecolmena.backend.service;

import com.mentecolmena.backend.model.Goal;
import com.mentecolmena.backend.repository.GoalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GoalService {
    private final GoalRepository goalRepository;

    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

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

    public Goal saveGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    public boolean updateGoal(String id, Goal newGoal) {
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

    public boolean deleteGoal(String id) {
        if (goalRepository.existsById(id)) {
            goalRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
