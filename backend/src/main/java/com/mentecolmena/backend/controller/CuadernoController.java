package com.mentecolmena.backend.controller;

import com.mentecolmena.backend.model.Cuaderno;
import com.mentecolmena.backend.service.CuadernoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/cuadernos")
public class CuadernoController {
    private final CuadernoService cuadernoService;

    public CuadernoController(CuadernoService cuadernoService) {
        this.cuadernoService = cuadernoService;
    }

    @GetMapping
    public List<Cuaderno> obtenerTodos() {
        return cuadernoService.obtenerTodos();
    }

    @PostMapping
    public Cuaderno crearCuaderno(@RequestBody Cuaderno cuaderno) {
        return cuadernoService.guardar(cuaderno);
    }

    @GetMapping("/{id}")
    public Cuaderno obtenerPorId(@PathVariable String id) {
        return cuadernoService.obtenerPorId(id).orElse(null);
    }

    @PutMapping("/{id}")
    public boolean actualizarCuaderno(@PathVariable String id, @RequestBody Cuaderno cuaderno) {
        return cuadernoService.actualizarCuaderno(id, cuaderno);
    }

    @DeleteMapping("/{id}")
    public boolean eliminarCuaderno(@PathVariable String id) {
        return cuadernoService.eliminarPorId(id);
    }
}
