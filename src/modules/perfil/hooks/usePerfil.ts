import { useEffect, useCallback } from 'react';
import { usePerfilStore } from './usePerfilStore';
import { PerfilService } from '../service/perfil.service';
import { useAuthStore } from '../../../stores/auth.store';

export const usePerfil = () => {
    const { perfil, loading, setPerfil, setLoading } = usePerfilStore();
    const usuarioAuth = useAuthStore(s => s.usuario);

    const cargarPerfil = useCallback(async () => {
        setLoading(true);
        try {
            const res = await PerfilService.get_perfil();
            if (res.success) {
                setPerfil(res.data);
            }
        } catch (error) {
            console.error('Error al cargar perfil:', error);
        } finally {
            setLoading(false);
        }
    }, [setPerfil, setLoading]);

    useEffect(() => {
        // Si no hay perfil, o si el ID del perfil no coincide con el ID del usuario logueado
        const necesitaCarga = !perfil || (usuarioAuth && perfil.id_usuario !== usuarioAuth.id_usuario);
        
        if (necesitaCarga && !loading) {
            cargarPerfil();
        }
    }, [perfil, usuarioAuth, cargarPerfil, loading]);

    return {
        perfil,
        loading,
        refetch: cargarPerfil
    };
};
