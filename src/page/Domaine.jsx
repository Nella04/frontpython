import React, { useState, useEffect } from 'react';
import axios from 'axios';

//const API_URL = 'http://localhost:8000/api';

const DomaineList = () => {
  const [domaines, setDomaines] = useState([]);
  const [newDomaine, setNewDomaine] = useState('');

  useEffect(() => {
    fetchDomaines();
  }, []);

  const fetchDomaines = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/domaines/`);
      setDomaines(response.data);
    } catch (error) {
      console.error('Error fetching domaines:', error);
    }
  };

  const addDomaine = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACK_URL}/api/domaines/`, {
        nom_domaine: newDomaine
      });
      setNewDomaine('');
      fetchDomaines();
    } catch (error) {
      console.error('Error adding domaine:', error);
    }
  };

  const deleteDomaine = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACK_URL}/api/domaines/${id}/`);
      fetchDomaines();
    } catch (error) {
      console.error('Error deleting domaine:', error);
    }
  };

  return (
    <div>
      <h2>Domaines</h2>
      <ul>
        {domaines.map(domaine => (
          <li key={domaine.id}>
            {domaine.nom_domaine}
            <button onClick={() => deleteDomaine(domaine.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newDomaine}
          onChange={(e) => setNewDomaine(e.target.value)}
          placeholder="Nouveau domaine"
        />
        <button onClick={addDomaine}>Ajouter</button>
      </div>
    </div>
  );
};

export default DomaineList;