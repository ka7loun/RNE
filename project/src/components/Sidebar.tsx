import React from 'react';
import { User, Lock, FileText, History, FileSpreadsheet, Briefcase, ReceiptText, Scale, FileSignature, Users, Clock } from 'lucide-react';

const SidebarItem = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => {
  return (
    <div className="flex items-center px-6 py-4 text-white hover:bg-primary/90 cursor-pointer transition-colors duration-200 border-b border-primary/20 group">
      <div className="mr-4 opacity-80 group-hover:opacity-100 transition-opacity duration-200">{icon}</div>
      <div className="text-nav group-hover:translate-x-1 transition-transform duration-200">{children}</div>
    </div>
  );
};

const Sidebar = () => {
  return (
    <aside className="bg-primary w-sidebar flex-shrink-0 h-screen">
      <div className="p-6 text-white text-title border-b border-primary/20 bg-primary/90 flex justify-between items-center">
        Mon Espace RNE
        <button className="p-2 rounded hover:bg-primary/80 transition-colors duration-200">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </div>
      
      <SidebarItem icon={<User size={20} />}>Mon Profil</SidebarItem>
      <SidebarItem icon={<Lock size={20} />}>Changer mot de passe</SidebarItem>
      <SidebarItem icon={<FileText size={20} />}>Mes Documents en instance</SidebarItem>
      <SidebarItem icon={<History size={20} />}>Historique des quittances</SidebarItem>
      <SidebarItem icon={<FileSpreadsheet size={20} />}>Historique des commandes</SidebarItem>
      <SidebarItem icon={<Briefcase size={20} />}>Espace E-service</SidebarItem>
      <SidebarItem icon={<ReceiptText size={20} />}>Gérer compte prépayé</SidebarItem>
      <SidebarItem icon={<Scale size={20} />}>Mes entreprises en instance</SidebarItem>
      <SidebarItem icon={<FileSignature size={20} />}>Dépôt des états financiers</SidebarItem>
      <SidebarItem icon={<Users size={20} />}>Déclaration Bénéficiaire Effectif</SidebarItem>
      <SidebarItem icon={<Clock size={20} />}>Réserver une dénomination</SidebarItem>
    </aside>
  );
};

export default Sidebar;