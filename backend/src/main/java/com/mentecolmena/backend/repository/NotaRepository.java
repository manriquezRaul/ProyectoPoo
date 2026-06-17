package com.mentecolmena.backend.repository;
import com.mentecolmena.backend.model.Nota;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface NotaRepository extends MongoRepository<Nota, String>{
} //añade todo los metodos del mongo