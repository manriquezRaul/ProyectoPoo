package com.mentecolmena.backend.controller;

import com.mentecolmena.backend.model.Usuario;
import com.mentecolmena.backend.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El correo electrónico es requerido."));
        }
        if (usuario.getPassword() == null || usuario.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "La contraseña es requerida."));
        }
        if (usuario.getFullName() == null || usuario.getFullName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El nombre completo es requerido."));
        }

        Optional<Usuario> existente = usuarioRepository.findByEmail(usuario.getEmail().trim().toLowerCase());
        if (existente.isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El correo electrónico ya se encuentra registrado."));
        }

        usuario.setEmail(usuario.getEmail().trim().toLowerCase());
        Usuario guardado = usuarioRepository.save(usuario);

        // Hide password in response
        guardado.setPassword(null);
        return ResponseEntity.ok(guardado);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String email = credenciales.get("email");
        String password = credenciales.get("password");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El correo electrónico es requerido."));
        }
        if (password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "La contraseña es requerida."));
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email.trim().toLowerCase());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Usuario no registrado. Por favor, regístrate primero."));
        }

        Usuario usuario = usuarioOpt.get();
        if (!password.equals(usuario.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Contraseña incorrecta. Inténtalo de nuevo."));
        }

        // Hide password in response
        usuario.setPassword(null);
        return ResponseEntity.ok(usuario);
    }

    @PostMapping("/actualizar")
    public ResponseEntity<?> actualizar(@RequestBody Usuario usuario) {
        if (usuario.getId() == null || usuario.getId().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El ID de usuario es requerido."));
        }
        Optional<Usuario> existenteOpt = usuarioRepository.findById(usuario.getId());
        if (existenteOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Usuario no encontrado."));
        }

        Usuario existente = existenteOpt.get();
        if (usuario.getFullName() != null && !usuario.getFullName().isBlank()) {
            existente.setFullName(usuario.getFullName().trim());
        }
        if (usuario.getEmail() != null && !usuario.getEmail().isBlank()) {
            String nuevoEmail = usuario.getEmail().trim().toLowerCase();
            if (!nuevoEmail.equals(existente.getEmail())) {
                Optional<Usuario> oterOpt = usuarioRepository.findByEmail(nuevoEmail);
                if (oterOpt.isPresent()) {
                    return ResponseEntity.badRequest().body(Map.of("error", "El correo electrónico ya está en uso."));
                }
                existente.setEmail(nuevoEmail);
            }
        }

        Usuario guardado = usuarioRepository.save(existente);
        guardado.setPassword(null);
        return ResponseEntity.ok(guardado);
    }
}
