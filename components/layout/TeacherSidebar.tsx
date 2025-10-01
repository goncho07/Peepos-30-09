
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';
import { teacherNavItems } from '../../data/nav';

const TeacherSidebar: React.FC = () => {
  const { isSidebarCollapsed } = useUIStore();
  const linkClasses = "flex items-center px-4 py-3.5 text-slate-600 dark:text-slate-100 rounded-lg hover:bg-indigo-100 dark:hover:bg-slate-800 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all duration-200 group relative font-medium";
  const activeLinkClasses = "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30";
  const logoUrl = 'https://cdn-icons-png.flaticon.com/512/2602/2602414.png';

  return (
    <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col z-40 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-slate-800 shrink-0 px-4">
        <img src={logoUrl} alt="Logo del Colegio" className={`transition-all duration-300 ${isSidebarCollapsed ? 'h-12 w-12' : 'h-10 w-10'}`} />
        <AnimatePresence>
        {!isSidebarCollapsed && (
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="ml-2 text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight"
          >
            Portal Docente
          </motion.h1>
        )}
        </AnimatePresence>
      </div>
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-2">
          {teacherNavItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                <item.icon className={`h-6 w-6 shrink-0 transition-all ${isSidebarCollapsed ? 'mx-auto' : 'mr-4'}`} />
                <AnimatePresence>
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-base"
                  >
                    {item.text}
                  </motion.span>
                )}
                </AnimatePresence>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default TeacherSidebar;