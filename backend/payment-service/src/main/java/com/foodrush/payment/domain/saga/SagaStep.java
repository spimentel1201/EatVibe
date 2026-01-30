package com.foodrush.payment.domain.saga;

/**
 * Interfaz para un paso de SAGA.
 * 
 * <p>
 * Cada paso debe implementar:
 * - execute(): Lógica de negocio del paso
 * - compensate(): Lógica de rollback si falla un paso posterior
 * </p>
 * 
 * @param <T> Tipo del contexto compartido entre pasos
 */
public interface SagaStep<T> {

    /**
     * Nombre del paso para logging y debugging.
     */
    String getName();

    /**
     * Ejecuta la lógica de negocio del paso.
     * 
     * @param context Contexto compartido del SAGA
     * @throws Exception si el paso falla
     */
    void execute(T context) throws Exception;

    /**
     * Compensa (rollback) la ejecución del paso.
     * 
     * <p>
     * Se llama en orden inverso si un paso posterior falla.
     * Debe ser idempotente.
     * </p>
     * 
     * @param context Contexto compartido del SAGA
     */
    void compensate(T context);
}
