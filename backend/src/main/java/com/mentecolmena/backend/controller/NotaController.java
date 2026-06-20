package com.mentecolmena.backend.controller;
import java.util.List;

import com.mentecolmena.backend.model.Nota;
import com.mentecolmena.backend.service.NotaService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notas")
public class NotaController {

    private final NotaService notaService;
    public NotaController(NotaService notaService){
        this.notaService=notaService;
    }



    @GetMapping
    public List<Nota> obtenerNotas() {
        return notaService.obtenerTodas();
    }

    @PostMapping
    public Nota crearNota(@RequestBody Nota nota){
        return notaService.guardar(nota);
    }

    @DeleteMapping("/{id}")
    public boolean eliminarNota(@PathVariable String id){
        return notaService.eliminarPorId(id);
    }

    @PutMapping("/{id}")
    public boolean actualizarNota(@PathVariable String id, @RequestBody Nota nota){
        return notaService.actualizarNota(id,nota);
    }

}
