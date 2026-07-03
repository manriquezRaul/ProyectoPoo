package com.mentecolmena.backend.repository;

import com.mentecolmena.backend.model.SessionDay;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SessionDayRepository extends MongoRepository<SessionDay, String> {
    Optional<SessionDay> findByDate(String date);
}
