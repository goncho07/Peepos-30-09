import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, UserCheck, BookCheck, UserSearch, FileText, FileDown, Settings, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ModulePage from '../layouts/ModulePage';
import KpiCard from '../components/ui/KpiCard';
import Card from '../ui/Card';

const kpiData = [
  { title: 'Avance Carga de Notas', value: '78%', icon: TrendingUp, color: 'from-emerald-600 to-teal-800' },
  { title: 'Actas Pendientes', value: '4', icon: FileText, color: 'from-amber-600 to-orange-800' },
  { title: 'Alumnos en Riesgo', value: '18', icon: AlertTriangle, color: 'from-rose-600 to-red-800' },
  { title: 'Promedio General', value: '15.8', icon: BookCheck, color: 'from-sky-600 to-blue-800' },
];

const actionCards = [
    { title: 'Avance por Docente', description: 'Monitorear el progreso de cada docente en el registro de calificaciones.', icon: UserCheck, path: '/academico/avance-docentes' },
    { title: 'Monitoreo por Cursos', description: 'Revisar promedios, estado y distribución de notas por cada materia impartida.', icon: BookCheck, path: '/academico/monitoreo-cursos' },
    { title: 'Monitoreo por Estudiantes', description: 'Identificar alumnos con bajo rendimiento o ausentismo y ver su ficha académica.', icon: UserSearch, path: '/academico/monitoreo-estudiantes' },
    { title: 'Actas y Certificados', description: 'Gestionar el flujo de aprobación de actas de notas y generar certificados oficiales.', icon: FileText, path: '/academico/actas-certificados' },
    { title: 'Reportes y Descargas', description: 'Generar informes consolidados, matrices de calificación y otros documentos.', icon: FileDown, path: '/academico/reportes-descargas' },
    { title: 'Configuración Académica', description: 'Definir periodos, ponderaciones, competencias y umbrales de alerta.', icon: Settings, path: '/academico/configuracion' },
];

const AcademicoPage: React.FC = () => {
    const navigate = useNavigate();
  return (
    <ModulePage
        title="Módulo Académico"
        description="Supervise el proceso académico, desde el registro de notas hasta la generación de actas."
        icon={BookOpen}
        kpis={
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            >
                {kpiData.map(kpi => (
                    <motion.div 
                        key={kpi.title}
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    >
                      <KpiCard 
                        variant="gradient"
                        title={kpi.title}
                        value={kpi.value}
                        icon={kpi.icon}
                        color={kpi.color}
                      />
                    </motion.div>
                ))}
            </motion.div>
        }
        filters={<></>}
        content={
             <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
            >
                {actionCards.map(card => (
                    <motion.div key={card.path} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <Card onClick={() => navigate(card.path)} className="h-full flex flex-col justify-between group">
                            <div>
                                <div className="p-3 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 rounded-xl w-fit mb-4">
                                   <card.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{card.title}</h3>
                                <p className="text-base text-slate-500 dark:text-slate-400 mt-1">{card.description}</p>
                            </div>
                            <div className="flex items-center justify-end text-indigo-600 dark:text-indigo-400 font-semibold mt-4 text-base">
                                <span>Ir al módulo</span>
                                <ArrowRight size={20} className="ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        }
    />
  );
};

export default AcademicoPage;