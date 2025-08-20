import React from "react";
import axios from "axios";

// Fonction pour supprimer l'association
const supprimercanpos = async (candidatId, posteId) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/candidat-poste/?candidat=${candidatId}&poste=${posteId}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Erreur lors de la suppression de l\'association');
    
    console.log('Association supprimée');
    return true;
  } catch (error) {
    console.error('Erreur:', error);
    return false;
  }
};
export default supprimercanpos;