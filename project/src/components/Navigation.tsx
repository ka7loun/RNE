import React from 'react';

const Navigation = () => {
  return (
    <>
      <img src="/head.png" alt="Header" className="w-full object-cover" />
      <nav className="bg-text-primary text-white shadow-md">
        <div className="container mx-auto">
          <ul className="flex flex-wrap text-nav">
            <li className="px-6 py-4 hover:bg-text-primary/80 cursor-pointer transition-colors duration-200 border-r border-text-primary/20">
              Recherche Personnes
            </li>
            <li className="px-6 py-4 hover:bg-text-primary/80 cursor-pointer transition-colors duration-200 border-r border-text-primary/20">
              Recherche Sociétés
            </li>
            <li className="px-6 py-4 hover:bg-text-primary/80 cursor-pointer transition-colors duration-200 border-r border-text-primary/20">
              Extrait du Registre
            </li>
            <li className="px-6 py-4 hover:bg-text-primary/80 cursor-pointer transition-colors duration-200 border-r border-text-primary/20">
              Bulletin Officiel
            </li>
            <li className="px-6 py-4 hover:bg-text-primary/80 cursor-pointer transition-colors duration-200 border-r border-text-primary/20">
              Convocation Assemblée Générale
            </li>
            <li className="px-6 py-4 hover:bg-text-primary/80 cursor-pointer transition-colors duration-200 border-r border-text-primary/20">
              Payer une Redevance
            </li>
            <li className="px-6 py-4 hover:bg-text-primary/80 cursor-pointer transition-colors duration-200">
              Immatriculer Entreprise
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navigation;