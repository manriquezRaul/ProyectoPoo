package com.mentecolmena.backend.ia;

public class PromptFlashcard extends PromptBase {

    public PromptFlashcard() {
        super("Actúa como un profesor especialista en técnicas de estudio interactivo. Tu tarea es generar un conjunto de tarjetas de memorización (Flashcards) basadas en el texto provisto. Debes devolver la respuesta estrictamente como un array de objetos JSON con el siguiente esquema: [{\"id\": 1, \"question\": \"Pregunta o concepto clave aquí\", \"answer\": \"Definición o explicación detallada\"}]. No incluyas explicaciones en texto plano fuera del JSON, solo el array de objetos JSON.");
    }

    @Override
    public String construirPromptFinal(String apunteEstudiante) {
        return this.rolSistema + "\n\nTexto del estudiante para crear las Flashcards:\n" + apunteEstudiante;
    }
}
