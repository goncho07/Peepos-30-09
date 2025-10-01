import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsUpDown, ArrowUp, ArrowDown, Eye, KeyRound, Info, Send, Search, RefreshCw, Plus, ChevronLeft, ChevronRight, User, Shield, GraduationCap, Users2, UserX, Pencil } from 'lucide-react';
import { UserRole, UserStatus, Student, Staff, ParentTutor, GenericUser, SortConfig } from '../../types';
import Tag from '../ui/Tag';
import Button from '../ui/Button';

const getStatusChipClass = (status: UserStatus) => {
    switch (status) {
        case 'Activo': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 ring-1 ring-inset ring-emerald-200 dark:ring-emerald-500/30';
        case 'Inactivo': return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 ring-1 ring-inset ring-slate-300 dark:ring-slate-600';
        case 'Suspendido': return 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 ring-1 ring-inset ring-amber-200 dark:ring-amber-500/30';
        case 'Egresado': return 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300 ring-1 ring-inset ring-sky-200 dark:ring-sky-500/30';
        case 'Pendiente': return 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300 ring-1 ring-inset ring-sky-200 dark:ring-sky-500/30';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getRole = (user: GenericUser) => {
    if ('studentCode' in user) return 'Estudiante';
    if ('relation' in user) return 'Apoderado';
    if ('category' in user) return user.category;
    return 'N/A';
}

const getRoleIcon = (role: UserRole | 'N/A') => {
    const props = { size: 16, className: "shrink-0" };
    switch(role) {
        case 'Director':
        case 'Administrativo': return <Shield {...props} className="text-blue-500" />;
        case 'Docente':
        case 'Apoyo': return <GraduationCap {...props} className="text-emerald-500" />;
        case 'Estudiante': return <User {...props} className="text-indigo-500" />;
        case 'Apoderado': return <Users2 {...props} className="text-purple-500" />;
        default: return <User {...props} className="text-slate-500" />;
    }
};

type AllUserKeys = keyof Student | keyof Staff | keyof ParentTutor;
interface SortConfigExtended { key: AllUserKeys, direction: 'asc' | 'desc' };

// FIX: Changed sortConfig prop type from SortConfigExtended to SortConfig to match what UserTable receives.
const TableHeader: React.FC<{ columnKey: string, label: string, sortConfig: SortConfig | null, onSort: (key: string) => void, className?: string }> = ({ columnKey, label, sortConfig, onSort, className = '' }) => (
    <th className={`px-3 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap text-left ${className}`}>
        <button onClick={() => onSort(columnKey)} className="flex items-center gap-1 group w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
            {label}
            <div className="opacity-30 group-hover:opacity-100 transition-opacity">
                {sortConfig?.key === columnKey ? (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ChevronsUpDown size={14} />}
            </div>
        </button>
    </th>
);

const UserTableRow: React.FC<{ user: GenericUser, isSelected: boolean, onSelect: () => void, onAction: (action: string, user: GenericUser, event: React.MouseEvent<HTMLButtonElement>) => void }> = React.memo(({ user, isSelected, onSelect, onAction }) => {
    const name = 'studentCode' in user ? user.fullName : user.name;
    
    const roleRaw = 'role' in user && user.role ? (user as Staff).role : getRole(user);
    const roleDisplay = roleRaw.replace('_', '-');
    const roleForIcon = getRole(user);

    let areaDisplay = 'N/A';
    if ('category' in user && (user as Staff).category === 'Docente') {
        const staffUser = user as Staff;
        if (staffUser.role === 'Docente_Inicial' || staffUser.role === 'Docente_Primaria') {
            areaDisplay = 'Todos';
        } else {
            areaDisplay = staffUser.area;
        }
    } else if ('grade' in user) {
        const studentUser = user as Student;
        areaDisplay = `${studentUser.grade} "${studentUser.section}"`;
    } else if ('area' in user) {
        areaDisplay = (user as Staff).area;
    }

    return (
        <tr className={`border-b border-slate-100 dark:border-slate-700 transition-colors h-16 ${isSelected ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
            <td onClick={e => e.stopPropagation()} className="sticky left-0 bg-inherit px-3"><input type="checkbox" checked={isSelected} onChange={onSelect} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"/></td>
            <td className="sticky left-12 bg-inherit px-3 truncate">
                <div className="flex items-center gap-4">
                    <img src={user.avatarUrl} alt={name} className="w-10 h-10 rounded-full" />
                    <div>
                        <div className="flex items-center gap-2">
                           <button onClick={(e) => onAction('view-details', user, e)} className="text-left font-bold text-lg text-slate-800 dark:text-slate-100 capitalize hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-slate-900 rounded">
                               {name.toLowerCase()}
                           </button>
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-3 text-slate-600 dark:text-slate-300 text-base truncate">
                <div className="flex items-center gap-2">{getRoleIcon(roleForIcon)}<span>{roleDisplay}</span></div>
            </td>
            <td className="px-3 text-slate-600 dark:text-slate-300 text-base truncate">{areaDisplay}</td>
            <td onClick={e => e.stopPropagation()} className="sticky right-0 bg-inherit px-3">
                 <button onClick={(e) => onAction('view-details', user, e)} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500" aria-label={`Ver detalles de ${name}`}>
                    <Pencil size={20} />
                </button>
            </td>
        </tr>
    );
});

const UserTableRowSkeleton = () => (
    <tr className="border-b border-slate-100 dark:border-slate-700 h-16">
        <td className="sticky left-0 bg-inherit px-3 w-12 z-10"><div className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse"></div></td>
        <td className="sticky left-12 bg-inherit px-3 min-w-64 z-10">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                <div>
                    <div className="h-6 w-36 rounded bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                </div>
            </div>
        </td>
        <td className="px-3"><div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-700 animate-pulse"></div></td>
        <td className="px-3"><div className="h-6 w-28 rounded bg-slate-200 dark:bg-slate-700 animate-pulse"></div></td>
        <td className="px-3"><div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse mx-auto"></div></td>
    </tr>
);

const EmptyState: React.FC<{ onClearFilters: () => void; onCreateUser: (e: React.MouseEvent<HTMLButtonElement>) => void; }> = ({ onClearFilters, onCreateUser }) => (
    <tr>
        <td colSpan={5} className="text-center py-20">
            <div className="max-w-md mx-auto">
                <Search size={52} className="mx-auto text-slate-400 dark:text-slate-500" />
                <h3 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-100">No se encontraron resultados</h3>
                <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
                    Pruebe ajustar los filtros o el término de búsqueda para encontrar lo que busca.
                </p>
                <div className="mt-8 flex items-center justify-center gap-2">
                    <Button variant="secondary" onClick={onClearFilters} icon={RefreshCw} aria-label="Limpiar Filtros">Limpiar Filtros</Button>
                    <Button variant="primary" onClick={onCreateUser} icon={Plus} aria-label="Crear Usuario">Crear Usuario</Button>
                </div>
            </div>
        </td>
    </tr>
);

const Pagination: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void }> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-between mt-4">
            <Button variant="secondary" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} icon={ChevronLeft} aria-label="Página Anterior">Anterior</Button>
            <span className="text-sm text-slate-500">Página {currentPage} de {totalPages}</span>
            <Button variant="secondary" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Siguiente Página">Siguiente <ChevronRight size={16}/></Button>
        </div>
    );
};


interface UserTableProps {
    isLoading: boolean;
    users: GenericUser[];
    selectedUsers: Set<string>;
    setSelectedUsers: React.Dispatch<React.SetStateAction<Set<string>>>;
    sortConfig: SortConfig | null;
    setSortConfig: (config: SortConfig) => void;
    onAction: (action: string, user: GenericUser, event: React.MouseEvent<HTMLButtonElement>) => void;
    onClearFilters: () => void;
    onCreateUser: (event: React.MouseEvent<HTMLButtonElement>) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
    isLoading, users, selectedUsers, setSelectedUsers, sortConfig, setSortConfig, onAction, onClearFilters, onCreateUser, currentPage, totalPages, onPageChange
}) => {
    const handleSort = (key: string) => {
        setSortConfig({ key: key as any, direction: sortConfig && sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc' });
    };
    
    const getId = (user: GenericUser) => 'studentCode' in user ? user.documentNumber : user.dni;

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedUsers(e.target.checked ? new Set(users.map(getId)) : new Set());
    };

    const isPageSelected = users.length > 0 && selectedUsers.size > 0 && users.every(u => selectedUsers.has(getId(u)));

    return (
        <>
            <div className="overflow-x-hidden bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-700/80">
                <table className="w-full table-fixed">
                    <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm">
                        <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                            <th className="sticky left-0 bg-slate-50 dark:bg-slate-800/80 px-3 w-12 z-20"><input type="checkbox" checked={isPageSelected} onChange={handleSelectAll} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"/></th>
                            <TableHeader columnKey="fullName" label="Nombre" sortConfig={sortConfig} onSort={handleSort} className="sticky left-12 w-2/5" />
                            <TableHeader columnKey="role" label="Rol" sortConfig={sortConfig} onSort={handleSort} className="w-1/4" />
                            <th className="px-3 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap text-left w-1/4">Área</th>
                            <th className="px-3 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 text-left sticky right-0 bg-slate-50 dark:bg-slate-800/80 z-20 w-24">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 10 }).map((_, i) => <UserTableRowSkeleton key={i}/>)
                        ) : users.length > 0 ? (
                            users.map(user => <UserTableRow key={getId(user)} user={user} isSelected={selectedUsers.has(getId(user))} onSelect={() => {
                                setSelectedUsers(prev => { const newSelection = new Set(prev); newSelection.has(getId(user)) ? newSelection.delete(getId(user)) : newSelection.add(getId(user)); return newSelection; });
                            }} onAction={onAction} />)
                        ) : (
                           <EmptyState onClearFilters={onClearFilters} onCreateUser={onCreateUser} />
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </>
    );
};

export default UserTable;