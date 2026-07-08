package com.mentecolmena.backend.service;

import com.mentecolmena.backend.model.Nota;
import com.mentecolmena.backend.repository.NotaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotaServiceTest {

    @Mock
    private NotaRepository notaRepository;

    @InjectMocks
    private NotaService notaService;

    private Nota notaSample;

    @BeforeEach
    void setUp() {
        notaSample = new Nota();
        notaSample.setId("101");
        notaSample.setTitulo("My Study Note");
        notaSample.setContenido("Important content regarding Spring Boot unit testing.");
        notaSample.setSubject("Software Engineering");
        notaSample.setCreatedAt(Instant.now());
        notaSample.setPinned(false);
    }

    @Test
    void testObtenerTodas() {
        when(notaRepository.findAll()).thenReturn(List.of(notaSample));

        List<Nota> result = notaService.obtenerTodas();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("My Study Note", result.get(0).getTitulo());
        verify(notaRepository, times(1)).findAll();
    }

    @Test
    void testGuardar_SetsDefaultSubjectAndSaves() {
        Nota input = new Nota();
        input.setTitulo("Blank Subject Note");
        // subject, createdAt are null

        when(notaRepository.save(any(Nota.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Nota saved = notaService.guardar(input);

        assertNotNull(saved);
        assertEquals("General", saved.getSubject());
        assertNotNull(saved.getCreatedAt());
        verify(notaRepository, times(1)).save(input);
    }

    @Test
    void testGuardar_KeepsExistingSubjectAndSaves() {
        Nota input = new Nota();
        input.setTitulo("Math Note");
        input.setSubject("Calculus");

        when(notaRepository.save(any(Nota.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Nota saved = notaService.guardar(input);

        assertNotNull(saved);
        assertEquals("Calculus", saved.getSubject());
        assertNotNull(saved.getCreatedAt());
        verify(notaRepository, times(1)).save(input);
    }

    @Test
    void testEliminarPorId_Exists() {
        when(notaRepository.existsById("101")).thenReturn(true);
        doNothing().when(notaRepository).deleteById("101");

        boolean deleted = notaService.eliminarPorId("101");

        assertTrue(deleted);
        verify(notaRepository, times(1)).existsById("101");
        verify(notaRepository, times(1)).deleteById("101");
    }

    @Test
    void testEliminarPorId_NotExists() {
        when(notaRepository.existsById("102")).thenReturn(false);

        boolean deleted = notaService.eliminarPorId("102");

        assertFalse(deleted);
        verify(notaRepository, times(1)).existsById("102");
        verify(notaRepository, never()).deleteById(anyString());
    }

    @Test
    void testObtenerPorId_Found() {
        when(notaRepository.findById("101")).thenReturn(Optional.of(notaSample));

        Optional<Nota> result = notaService.obtenerPorId("101");

        assertTrue(result.isPresent());
        assertEquals("My Study Note", result.get().getTitulo());
        verify(notaRepository, times(1)).findById("101");
    }

    @Test
    void testObtenerPorId_NotFound() {
        when(notaRepository.findById("102")).thenReturn(Optional.empty());

        Optional<Nota> result = notaService.obtenerPorId("102");

        assertFalse(result.isPresent());
        verify(notaRepository, times(1)).findById("102");
    }

    @Test
    void testActualizarNota_Success() {
        Nota updateData = new Nota();
        updateData.setTitulo("Updated Title");
        updateData.setContenido("Updated content here");
        updateData.setSubject("Data Structures");
        updateData.setPinned(true);

        when(notaRepository.findById("101")).thenReturn(Optional.of(notaSample));
        when(notaRepository.save(any(Nota.class))).thenReturn(notaSample);

        boolean updated = notaService.actualizarNota("101", updateData);

        assertTrue(updated);
        assertEquals("Updated Title", notaSample.getTitulo());
        assertEquals("Updated content here", notaSample.getContenido());
        assertEquals("Data Structures", notaSample.getSubject());
        assertTrue(notaSample.isPinned());
        verify(notaRepository, times(1)).findById("101");
        verify(notaRepository, times(1)).save(notaSample);
    }

    @Test
    void testActualizarNota_NotFound() {
        Nota updateData = new Nota();
        updateData.setTitulo("Some Title");

        when(notaRepository.findById("102")).thenReturn(Optional.empty());

        boolean updated = notaService.actualizarNota("102", updateData);

        assertFalse(updated);
        verify(notaRepository, times(1)).findById("102");
        verify(notaRepository, never()).save(any(Nota.class));
    }
}
