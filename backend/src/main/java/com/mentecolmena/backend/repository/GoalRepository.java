package com.mentecolmena.backend.repository;

import com.mentecolmena.backend.model.Goal;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GoalRepository extends MongoRepository<Goal, String> {
}
