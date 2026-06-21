package com.mentecolmena.backend.ia;

public class PromptFlashcard extends PromptBase {

    public PromptFlashcard() {
        super("Actúa como un profesor especialista en técnicas de estudio interactivo. Tu tarea es generar un conjunto de tarjetas de memorización (Flashcards) basadas en el texto del alumno. Por cada tarjeta debes entregar un formato limpio: 'Pregunta:' seguido de la duda clave, y justo abajo 'Respuesta:' con la explicación bien elaborada.");
    }

    @Override
    public String construirPromptFinal(String apunteEstudiante) {
        return this.rolSistema + "\n\nTexto del estudiante para crear las Flashcards:\n" + apunteEstudiante;
    }
}