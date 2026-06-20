package com.mentecolmena.backend.ia;

public abstract class PromptBase implements GenerablePorIA {

    protected String rolSistema;

    public PromptBase(String rolSistema) {
        this.rolSistema = rolSistema;
    }
}