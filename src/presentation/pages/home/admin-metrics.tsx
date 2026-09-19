import { useEffect, useState } from "react";
import {
  BuildingStorefrontIcon,
  CubeIcon,
  ClipboardDocumentCheckIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { Skeleton, Badge, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { AuxService } from "../../../service/auxiliar.service";
import { CuentasService } from "../../../modules/cuentas/service/cuentas.service";
import { AtencionService } from "../../../modules/requerimientos-almacen-atencion/service/atencion.service";
import { Estado_Requerimiento } from "../../../shared/enums/requerimiento-almacen/requerimiento";

interface SystemMetrics {
  totalAlmacenes: number;
  totalProductos: number;
  totalCuentas: number;
  totalRequerimientos: number;
  requerimientosPendientes: number;
  requerimientosAtendidos: number;
  requerimientosEnAtencion: number;
}

export const AdminMetrics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalAlmacenes: 0,
    totalProductos: 0,
    totalCuentas: 0,
    totalRequerimientos: 0,
    requerimientosPendientes: 0,
    requerimientosAtendidos: 0,
    requerimientosEnAtencion: 0,
  });

  useEffect(() => {
    let mounted = true;
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const [almacenesRes, productosRes, cuentasRes, reqsRes] =
          await Promise.allSettled([
            AuxService.get_almacenes(),
            AuxService.get_productos(),
            CuentasService.fetchCuentas(),
            AtencionService.obtenerRequerimientos(),
          ]);

        if (!mounted) return;

        const almacenes =
          almacenesRes.status === "fulfilled" && almacenesRes.value.success
            ? almacenesRes.value.data
            : [];
        const productos =
          productosRes.status === "fulfilled" && productosRes.value.success
            ? productosRes.value.data
            : [];
        const cuentas =
          cuentasRes.status === "fulfilled" && cuentasRes.value.success
            ? cuentasRes.value.data
            : [];
        const reqs =
          reqsRes.status === "fulfilled" && reqsRes.value.success
            ? reqsRes.value.data
            : [];

        const pendientes = reqs.filter(
          (r) => r.estado === Estado_Requerimiento.Generado,
        ).length;
        const enAtencion = reqs.filter(
          (r) => r.estado === Estado_Requerimiento.EnDespacho,
        ).length;
        const atendidos = reqs.filter(
          (r) =>
            r.estado === Estado_Requerimiento.Completado ||
            r.estado === Estado_Requerimiento.Cerrado,
        ).length;

        setMetrics({
          totalAlmacenes: almacenes.length,
          totalProductos: productos.length,
          totalCuentas: cuentas.length,
          totalRequerimientos: reqs.length,
          requerimientosPendientes: pendientes,
          requerimientosEnAtencion: enAtencion,
          requerimientosAtendidos: atendidos,
        });
      } catch (err) {
        console.error("Error al cargar métricas:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMetrics();
    return () => {
      mounted = false;
    };
  }, []);

  const metricCards = [
    {
      title: "Almacenes Registrados",
      value: metrics.totalAlmacenes,
      subtitle: "Centros de acopio y custodia",
      icon: BuildingStorefrontIcon,
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      badgeColor: "blue",
      link: "/almacenes",
    },
    {
      title: "Catálogo de Productos",
      value: metrics.totalProductos,
      subtitle: "Bienes registrados en inventario",
      icon: CubeIcon,
      color: "from-emerald-500/20 to-teal-500/20",
      borderColor: "border-emerald-500/30",
      badgeColor: "teal",
      link: "/productos",
    },
    {
      title: "Pedidos de Materiales",
      value: metrics.totalRequerimientos,
      subtitle: `${metrics.requerimientosPendientes} pendientes / ${metrics.requerimientosAtendidos} atendidos`,
      icon: ClipboardDocumentCheckIcon,
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      badgeColor: "grape",
      link: "/pedidos",
    },
    {
      title: "Cuentas de Usuario",
      value: metrics.totalCuentas,
      subtitle: "Usuarios activos del sistema",
      icon: UsersIcon,
      color: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/30",
      badgeColor: "yellow",
      link: "/usuarios",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 space-y-4"
            >
              <Skeleton height={20} width={80} radius="md" />
              <Skeleton height={40} width={120} radius="md" />
              <Skeleton height={14} width="90%" radius="sm" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Grid de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => navigate(card.link)}
              className={`cursor-pointer group relative overflow-hidden rounded-3xl p-6 bg-zinc-900/40 border border-zinc-800/80 hover:${card.borderColor} transition-all duration-300 hover:shadow-xl hover:shadow-black/40`}
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${card.color} opacity-30 group-hover:opacity-60 transition-opacity`}
              />
              <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className="p-2.5 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight">
                    {card.value}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">{card.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Panel de Operaciones del Sistema */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <ArrowTrendingUpIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">
                Resumen de Operaciones y Atención de Pedidos
              </h2>
              <p className="text-xs text-zinc-400">
                Monitoreo consolidado de las actividades operativas en almacenes
              </p>
            </div>
          </div>
          <Badge variant="dot" color="indigo" size="lg">
            Dashboard Administrativo
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-2xl p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400">
                Pendientes de Atención
              </span>
              <p className="text-2xl font-bold text-amber-400">
                {metrics.requerimientosPendientes}
              </p>
              <Text size="11px" c="dimmed">
                Requerimientos por despachar
              </Text>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <ClockIcon className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-2xl p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400">
                En Proceso / Parcial
              </span>
              <p className="text-2xl font-bold text-blue-400">
                {metrics.requerimientosEnAtencion}
              </p>
              <Text size="11px" c="dimmed">
                Despacho en curso
              </Text>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
              <ExclamationCircleIcon className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-2xl p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400">
                Completamente Atendidos
              </span>
              <p className="text-2xl font-bold text-emerald-400">
                {metrics.requerimientosAtendidos}
              </p>
              <Text size="11px" c="dimmed">
                Entregas culminadas
              </Text>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
