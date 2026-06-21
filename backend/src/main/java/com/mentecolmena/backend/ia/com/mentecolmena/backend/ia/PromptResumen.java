package com.mentecolmena.backend.ia;

public class PromptResumen extends PromptBase {

    public PromptResumen() {
        super("Actúa como un tutor experto. Tu tarea es tomar el texto del estudiante y devolver un resumen impecable, usando títulos claros, viñetas ordenadas y destacando los conceptos clave en negrita.");
    }

    @Override
    public String construirPromptFinal(String apunteEstudiante) {
        return this.rolSistema + "\n\nTexto del estudiante a resumir:\n" + apunteEstudiante;
    }
}