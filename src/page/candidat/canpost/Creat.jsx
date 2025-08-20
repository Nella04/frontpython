import React from "react";
import axios from "axios";

// Fonction pour créer l'association candidat-poste
const creercanpos = async (candidatId, posteId) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/candidat-postes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        candidat: candidatId,
        poste: posteId
      }),
    });

    if (!response.ok) throw new Error('Erreur lors de la création de l\'association');
    
    const data = await response.json();
    console.log('Association créée:', data);
    return true;
  } catch (error) {
    console.error('Erreur:', error);
    return false;
  }
};


export default creercanpos;