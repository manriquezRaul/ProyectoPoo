package com.mentecolmena.backend.service;

import com.mentecolmena.backend.model.Cuaderno;
import com.mentecolmena.backend.repository.CuadernoRepository;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CuadernoService {
    private final CuadernoRepository cuadernoRepository;

    public CuadernoService(CuadernoRepository cuadernoRepository) {
        this.cuadernoRepository = cuadernoRepository;
    }

    public List<Cuaderno> obtenerTodos() {
        return cuadernoRepository.findAll();
    }

    public Cuaderno guardar(Cuaderno cuaderno) {
        if (cuaderno.getNoteIds() == null) {
            cuaderno.setNoteIds(new ArrayList<>());
        }
        if (cuaderno.getCreatedAt() == null) {
            cuaderno.setCreatedAt(Instant.now());
        }
        return cuadernoRepository.save(cuaderno);
    }

    public Optional<Cuaderno> obtenerPorId(String id) {
        return cuadernoRepository.findById(id);
    }

    public boolean eliminarPorId(String id) {
        if (cuadernoRepository.existsById(id)) {
            cuadernoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean actualizarCuaderno(String id, Cuaderno nuevoCuaderno) {
        Optional<Cuaderno> op = cuadernoRepository.findById(id);
        if (op.isPresent()) {
            Cuaderno c = op.get();
            c.setTitulo(nuevoCuaderno.getTitulo());
            c.setDescripcion(nuevoCuaderno.getDescripcion());
            c.setMateria(nuevoCuaderno.getMateria());
            if (nuevoCuaderno.getNoteIds() != null) {
                c.setNoteIds(nuevoCuaderno.getNoteIds());
            }
            cuadernoRepository.save(c);
            return true;
        }
        return false;
    }
}
