import { Stack } from "@mantine/core";
import { useTitlePage } from "../../../hooks/useTitlePage";
import { usePerfil } from "../hooks/usePerfil";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileSection } from "./components/ProfileSection";
import { ProfileDataField } from "./components/ProfileDataField";

export const PerfilPage = () => {
  useTitlePage("Mi Perfil");
  const { perfil, loading } = usePerfil();

  // Remove full-page skeleton condition
  if (!loading && !perfil) return null;

  return (
    <div className="ml-[72px]">
      <Stack
        gap={45}
        className="animate-fade-in pt-10 mb-20 w-full max-w-xl mx-auto"
      >
        {/* Profile Header */}
        <ProfileHeader
          username={perfil?.username}
          url_foto={perfil?.url_foto}
          nombre_rol={perfil?.nombre_rol}
          nombre_cargo={perfil?.nombre_cargo}
          loading={loading}
        />

        {/* SECCIÓN PERSONAL */}
        <ProfileSection title="Información Personal">
          <ProfileDataField
            label="Nombres"
            value={perfil?.nombre}
            loading={loading}
          />
          <ProfileDataField
            label="Apellidos"
            value={perfil?.apellido}
            loading={loading}
          />
          <ProfileDataField
            label="Documento de Identidad (DNI)"
            value={perfil?.dni}
            loading={loading}
          />
          <ProfileDataField
            label="Fecha de Nacimiento"
            value={perfil?.fecha_nacimiento}
            loading={loading}
          />
          <ProfileDataField
            label="RUC Personal"
            value={perfil?.ruc}
            loading={loading}
          />
          <ProfileDataField
            label="Carnet de Extranjería"
            value={perfil?.carnet_extranjeria}
            loading={loading}
          />
          <ProfileDataField
            label="Pasaporte"
            value={perfil?.pasaporte}
            loading={loading}
          />
        </ProfileSection>

        {/* SECCIÓN LABORAL */}
        <ProfileSection title="Información Laboral">
          {perfil?.es_contratista ? (
            <>
              <ProfileDataField
                label="Tipo de Personal"
                value="Contratista"
                loading={loading}
              />
              <ProfileDataField
                label="Mina Asignada"
                value={perfil?.mina_nombre || (loading ? "" : "Sin asignar")}
                loading={loading}
              />
            </>
          ) : (
            <>
              <ProfileDataField
                label="Empresa a la que Pertenece"
                value={perfil?.empresa_nombre || (loading ? "" : "Sin asignar")}
                loading={loading}
              />
              <ProfileDataField
                label="Área o Departamento"
                value={perfil?.nombre_area}
                loading={loading}
              />
              <ProfileDataField
                label="Cargo Desempeñado"
                value={perfil?.nombre_cargo}
                loading={loading}
              />
            </>
          )}
          <ProfileDataField
            label="Nivel de Acceso (Rol)"
            value={perfil?.nombre_rol}
            loading={loading}
          />
        </ProfileSection>
      </Stack>
    </div>
  );
};
