package com.mentecolmena.backend.service;

import com.mentecolmena.backend.model.Nota;
import com.mentecolmena.backend.repository.NotaRepository;
import org.springframework.stereotype.Service;

import java.util.List; //Debido a que mongoRepository usa list, no arraylist


public class NotaService {
    private final NotaRepository notaRepository;

    public NotaService(NotaRepository notaRepository){
        this.notaRepository = notaRepository;
    }

    public List<Nota> obtenerTodas(){
        return notaRepository.findAll();
    }
}