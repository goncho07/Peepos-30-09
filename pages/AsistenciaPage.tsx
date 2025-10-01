import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, QrCode, Download, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { students } from '../data/students';
import { staff } from '../data/users';
import { track } from '../analytics/track';

// New Architecture Components
import ModulePage from '../layouts/ModulePage';
import FilterBar from '../ui/FilterBar';
import KpiCard from '../components/ui/KpiCard';
import Table from '../ui/Table';
import Button from '../ui/Button';

type AttendanceTab = 'dashboard' | 'estudiantes' | 'personal';

const AsistenciaPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AttendanceTab>('dashboard');
  
  const attendanceData = useMemo(() => {
    return [...students, ...staff].map(user => {
        const isStudent = 'studentCode' in user;
        const name = isStudent ? user.fullName : user.name;
        const statusOptions = ['Presente', 'Tarde', 'Ausente'];
        const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        return {
            id: isStudent ? user.documentNumber : user.dni,
            name: name,
            avatarUrl: user.avatarUrl,
            type: isStudent ? 'Estudiante' : 'Personal',
            status: status,
            entryTime: status === 'Presente' ? '07:45 AM' : (status === 'Tarde' ? '08:15 AM' : null),
        };
    });
  }, []);

  const kpis = {
    studentAttendance: '92%',
    staffAttendance: '98%',
    latecomers: 15,
    absences: 8,
  };
  
  const getStatusChipClass = (status: string) => {
    switch (status) {
      case 'Presente': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300';
      case 'Tarde': return 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300';
      case 'Ausente': return 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const columns = [
      { key: 'name', header: 'Nombre', sortable: true, render: (item: any) => (
          <div className="flex items-center gap-3">
              <img src={item.avatarUrl} alt={item.name} className="w-10 h-10 rounded-full" />
              <span className="font-medium text-slate-800 dark:text-slate-100 capitalize">{item.name.toLowerCase()}</span>
          </div>
      )},
      { key: 'status', header: 'Estado', sortable: true, render: (item: any) => <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChipClass(item.status)}`}>{item.status}</span> },
      { key: 'entryTime', header: 'Hora de Ingreso', sortable: true, render: (item: any) => item.entryTime || 'N/A' },
  ];

  const renderContent = () => {
      const dataToShow = attendanceData.filter(d => activeTab === 'estudiantes' ? d.type === 'Estudiante' : d.type === 'Personal');
      return (
        <Table
            columns={columns}
            rows={dataToShow}
            getRowId={(item: any) => item.id}
            sortConfig={null} onSort={() => {}}
            selectable={false} selectedRowIds={new Set()} onSelect={() => {}} onSelectAll={() => {}}
        />
      );
  };

  return (
    <ModulePage
      title="Gestión de Asistencia"
      // FIX: Changed 'subtitle' prop to 'description' to match ModulePageProps interface.
      description="Monitoree la asistencia en tiempo real, gestione justificaciones y genere reportes."
      icon={ClipboardCheck}
      actionsRight={
          <>
              <Button variant="secondary" aria-label="Generar Reporte del Día" icon={Download} onClick={() => track('attendance_report_generated')}>Reporte del Día</Button>
              <Button variant="primary" aria-label="Escanear QR" icon={QrCode} onClick={() => {
                  track('attendance_qr_scanned');
                  navigate('/asistencia/scan');
              }}>Escanear QR</Button>
          </>
      }
      filters={<FilterBar activeFilters={[]} onRemoveFilter={()=>{}} onClearAll={()=>{}} />}
      content={
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 space-y-6">
              <nav className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
                  <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>Dashboard</button>
                  <button onClick={() => setActiveTab('estudiantes')} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full ${activeTab === 'estudiantes' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>Estudiantes</button>
                  <button onClick={() => setActiveTab('personal')} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full ${activeTab === 'personal' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>Personal</button>
              </nav>
              
              {activeTab === 'dashboard' ? (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard title="Asistencia Estudiantil (Hoy)" value={kpis.studentAttendance} icon={TrendingUp} />
                    <KpiCard title="Asistencia Personal (Hoy)" value={kpis.staffAttendance} icon={TrendingUp} />
                    <KpiCard title="Tardanzas (Hoy)" value={kpis.latecomers} icon={AlertTriangle} />
                    <KpiCard title="Ausencias (Hoy)" value={kpis.absences} icon={AlertTriangle} />
                 </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {renderContent()}
                </motion.div>
              )}
          </div>
      }
    />
  );
};

export default AsistenciaPage;