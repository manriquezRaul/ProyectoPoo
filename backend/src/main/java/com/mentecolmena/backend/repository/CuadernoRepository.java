package com.mentecolmena.backend.repository;

import com.mentecolmena.backend.model.Cuaderno;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CuadernoRepository extends MongoRepository<Cuaderno, String> {
}
