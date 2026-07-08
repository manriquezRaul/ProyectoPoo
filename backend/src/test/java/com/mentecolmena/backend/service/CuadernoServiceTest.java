package com.mentecolmena.backend.service;

import com.mentecolmena.backend.model.Cuaderno;
import com.mentecolmena.backend.repository.CuadernoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CuadernoServiceTest {

    @Mock
    private CuadernoRepository cuadernoRepository;

    @InjectMocks
    private CuadernoService cuadernoService;

    private Cuaderno cuadernoSample;

    @BeforeEach
    void setUp() {
        cuadernoSample = new Cuaderno();
        cuadernoSample.setId("1");
        cuadernoSample.setTitulo("Java Programming");
        cuadernoSample.setDescripcion("Notes about OOP and Java features");
        cuadernoSample.setMateria("OOP");
        cuadernoSample.setNoteIds(new ArrayList<>(List.of("note1", "note2")));
        cuadernoSample.setCreatedAt(Instant.now());
    }

    @Test
    void testObtenerTodos() {
        when(cuadernoRepository.findAll()).thenReturn(List.of(cuadernoSample));

        List<Cuaderno> result = cuadernoService.obtenerTodos();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Java Programming", result.get(0).getTitulo());
        verify(cuadernoRepository, times(1)).findAll();
    }

    @Test
    void testGuardar_SetsDefaultsAndSaves() {
        Cuaderno input = new Cuaderno();
        input.setTitulo("New Cuaderno");
        // noteIds and createdAt are null

        when(cuadernoRepository.save(any(Cuaderno.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Cuaderno saved = cuadernoService.guardar(input);

        assertNotNull(saved);
        assertNotNull(saved.getNoteIds());
        assertTrue(saved.getNoteIds().isEmpty());
        assertNotNull(saved.getCreatedAt());
        assertEquals("New Cuaderno", saved.getTitulo());
        verify(cuadernoRepository, times(1)).save(input);
    }

    @Test
    void testObtenerPorId_Found() {
        when(cuadernoRepository.findById("1")).thenReturn(Optional.of(cuadernoSample));

        Optional<Cuaderno> result = cuadernoService.obtenerPorId("1");

        assertTrue(result.isPresent());
        assertEquals("Java Programming", result.get().getTitulo());
        verify(cuadernoRepository, times(1)).findById("1");
    }

    @Test
    void testObtenerPorId_NotFound() {
        when(cuadernoRepository.findById("2")).thenReturn(Optional.empty());

        Optional<Cuaderno> result = cuadernoService.obtenerPorId("2");

        assertFalse(result.isPresent());
        verify(cuadernoRepository, times(1)).findById("2");
    }

    @Test
    void testEliminarPorId_Exists() {
        when(cuadernoRepository.existsById("1")).thenReturn(true);
        doNothing().when(cuadernoRepository).deleteById("1");

        boolean deleted = cuadernoService.eliminarPorId("1");

        assertTrue(deleted);
        verify(cuadernoRepository, times(1)).existsById("1");
        verify(cuadernoRepository, times(1)).deleteById("1");
    }

    @Test
    void testEliminarPorId_NotExists() {
        when(cuadernoRepository.existsById("2")).thenReturn(false);

        boolean deleted = cuadernoService.eliminarPorId("2");

        assertFalse(deleted);
        verify(cuadernoRepository, times(1)).existsById("2");
        verify(cuadernoRepository, never()).deleteById(anyString());
    }

    @Test
    void testActualizarCuaderno_Success() {
        Cuaderno updateData = new Cuaderno();
        updateData.setTitulo("Updated Java");
        updateData.setDescripcion("Updated description");
        updateData.setMateria("Advanced Java");
        updateData.setNoteIds(List.of("note3"));

        when(cuadernoRepository.findById("1")).thenReturn(Optional.of(cuadernoSample));
        when(cuadernoRepository.save(any(Cuaderno.class))).thenReturn(cuadernoSample);

        boolean updated = cuadernoService.actualizarCuaderno("1", updateData);

        assertTrue(updated);
        assertEquals("Updated Java", cuadernoSample.getTitulo());
        assertEquals("Updated description", cuadernoSample.getDescripcion());
        assertEquals("Advanced Java", cuadernoSample.getMateria());
        assertEquals(List.of("note3"), cuadernoSample.getNoteIds());
        verify(cuadernoRepository, times(1)).findById("1");
        verify(cuadernoRepository, times(1)).save(cuadernoSample);
    }

    @Test
    void testActualizarCuaderno_NotFound() {
        Cuaderno updateData = new Cuaderno();
        updateData.setTitulo("No effect");

        when(cuadernoRepository.findById("2")).thenReturn(Optional.empty());

        boolean updated = cuadernoService.actualizarCuaderno("2", updateData);

        assertFalse(updated);
        verify(cuadernoRepository, times(1)).findById("2");
        verify(cuadernoRepository, never()).save(any(Cuaderno.class));
    }
}
