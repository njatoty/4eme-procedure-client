

//Nex 
import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  CFormInput,
  CFormSelect,
  CButton,
} from '@coreui/react'

import './Salaire.css';
import CIcon from '@coreui/icons-react';
import { cilLibraryAdd, cilCloudUpload } from '@coreui/icons';
import ToastContainer from "./../../toast/toastService";
import { getEmployees, getSalaryEmployees, addSalaireEmployee, deleteSalaireEmployee, uploadFile } from '../../../services/salaireService';


function App() {
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); 

  // Calcul du mois et de l'année de début (12 mois avant le mois actuel)
  const startDate = new Date(currentYear, currentMonth - 11, 1); 
  const startMonth1 = startDate.getMonth(); 
  const startYear1 = startDate.getFullYear();

  // Mois et année de fin = mois actuel et année actuelle
  const endMonth1 = currentMonth;
  const endYear1 = currentYear;

  const [startMonth, setStartMonth] = useState(startMonth1); 
  const [startYear, setStartYear] = useState(startYear1); 
  const [endMonth, setEndMonth] = useState(endMonth1); 
  const [endYear, setEndYear] = useState(endYear1); 

  const years = Array.from({ length: 4 }, (_, i) => startYear + i);

  const [employees, setEmployees] = useState([]);
  const [salaryEmployees, setSalaryEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [monthlySalaries, setMonthlySalaries] = useState('');
  const [selectedMonth, setSelectedMonth] = useState("");
  const [year, setYear] = useState(currentYear);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [file, setFile] = useState(null)

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];


  const handleFileChange = (event)=>{
    setFile(event.target.files[0])
  }

  const handleUpload = async () => {

    setLoading(true)
    if(!file){
      window.showToast("VEUILLEZ SELECTIONNER UN FICHIER!", "danger")
      // window.showToast("Operation successful!", "success")
      return
    }

    try {
      let dataUpload = await uploadFile(file)

      setSalaryEmployees((prevSalaries) => updateMultipleSalaries(prevSalaries, dataUpload.salary));
      console.log("prev", salaryEmployees);
      
      console.log("finish upload");
      window.showToast("AJOUT REUSSI!", "success")
      setLoading(false)

    } catch (error) {
      toast.error('Erreur')
    }

    
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeData, salaryData] = await Promise.all([getEmployees(), getSalaryEmployees()]);
        setEmployees(employeeData);
        setSalaryEmployees(salaryData);
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAddEmployeeSalary = async (e) => {
    e.preventDefault();

    if (!employeeId || !year || !monthlySalaries) {
      window.showToast("VEUILLEZ REMPLIS TOUS LES CHAMPS", "danger")
      // alert("Veuillez remplir tous les champs");
      return;
    }

    const salaryData = {
      employeeId,
      monthlySalaries: { [selectedMonth]: parseInt(monthlySalaries) },
      year: parseInt(year),
    };

    await submitSalary(salaryData);
    window.showToast("AJOUT REUSSI", "success")
  };

  const handleSalaryUpdate = useCallback(async (id, month, year, newSalary) => {
    const salaryData = {
      employeeId: id,
      monthlySalaries: { [month]: parseInt(newSalary) },
      year: parseInt(year),
    };

    await submitSalary(salaryData);
    // window.showToast("MIS A JOURS REUSSI!", "success")
  }, []);

  const submitSalary = async (salaryData) => {
    try {
      const createdSalary = await addSalaireEmployee(salaryData);
      console.log("cre", createdSalary);
      

      setSalaryEmployees((prevSalaries) => updateSalaryList(prevSalaries, createdSalary.salary));

    } catch (error) {
      console.error(error);
      setError("Échec de l'ajout du salaire");
    }
  };

  const updateSalaryList = (prevSalaries, newSalary) => {
    const { employeeId, year, monthlySalaries } = newSalary;
    const existingIndex = prevSalaries.findIndex((sal) => sal.employeeId._id === employeeId._id && sal.year === year);

    
    if (existingIndex !== -1) {
      return prevSalaries.map((sal, index) =>
        index === existingIndex ? { ...sal, monthlySalaries: { ...sal.monthlySalaries, ...monthlySalaries } } : sal
      );
    }

    return [...prevSalaries, newSalary];
  };
  
  // Fonction pour ajouter ou mettre à jour les salaires de plusieurs employés
  const updateMultipleSalaries = (prevSalaries, newSalaries) => {
    
    // Boucle sur chaque nouvel élément (nouveau salaire)
    // let newS = newSalaries.forEach(newSalary => {
    //   const { employeeId, year, monthlySalaries } = newSalary;
      
    //   const existingIndex = prevSalaries.findIndex((sal) => sal.employeeId._id === employeeId._id && sal.year === year);

    //   if (existingIndex !== -1) {
    //     return prevSalaries.map((sal, index) =>
    //       index === existingIndex ? { ...sal, monthlySalaries: { ...sal.monthlySalaries, ...monthlySalaries } } : sal
    //     );
    //   }
  
    //   return [...prevSalaries, newSalary];
    // });
    let newS = newSalaries.reduce((acc, newSalary) => {
      const { employeeId, year, monthlySalaries } = newSalary;
    
      const existingIndex = acc.findIndex(
        (sal) => sal.employeeId._id === employeeId._id && sal.year === year
      );
    
      if (existingIndex !== -1) {
        acc[existingIndex] = {
          ...acc[existingIndex],
          monthlySalaries: { ...acc[existingIndex].monthlySalaries, ...monthlySalaries }
        };
        return acc;
      }
    
      return [...acc, newSalary];
    }, [...prevSalaries]);

    
    console.log("prevSalaries", newS);
    
    return newS;
  };

  const handleDeleteEmployee = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      try {
        await deleteSalaireEmployee(id);
        setSalaryEmployees(prevSalaries => prevSalaries.filter(sal => sal.employeeId._id !== id));
        
        window.showToast("SUPPRESSION REUSSIE!", "success")
      } catch (error) {
        window.showToast("ERREUR LORS DE LA SUPPRESSION!", "danger")
        console.error("Erreur lors de la suppression", error);
      }
    }
  };

  // Fonction pour générer les clés de mois-année entre deux dates
  function generateDateRangeKeys(startMonth, startYear, endMonth, endYear) {
    const keys = [];
    let currentMonth = startMonth;
    let currentYear = startYear;

    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
      // Formater le mois et l'année en chaîne 'mois-année'
      const key = `${String(currentMonth).padStart(2, '0')}-${currentYear}`;
      keys.push(key);

      // Passer au mois suivant
      if (currentMonth === 12) {
        currentMonth = 1;
        currentYear++;
      } else {
        currentMonth++;
      }
    }

    return keys;
  }


  // Générer les clés de la plage de dates sélectionnée
  const selectedKeys = generateDateRangeKeys(startMonth, startYear, endMonth, endYear);

  // Regrouper les salaires par employé et fusionner les années
  const mergedSalaries = salaryEmployees.reduce((acc, sal) => {

    const empId = sal.employeeId._id;

    if (!acc[empId]) {
      acc[empId] = {
        ...sal,
        monthlySalaries: {}, // On initialise un objet vide pour les salaires
        employeeId: sal.employeeId,
      };
    }

    // Filtrer les salaires pour ne conserver que ceux dans la plage sélectionnée
    Object.keys(sal.monthlySalaries).forEach(month => {

      const key = `${String(month).padStart(2, '0')}-${sal.year}`;

      if (selectedKeys.includes(key)) {
        acc[empId].monthlySalaries[`${month}-${sal.year}`] = sal.monthlySalaries[month];
      }
    });

    return acc;
  }, {});

  // Convertir en tableau
  const mergedSalaryList = Object.values(mergedSalaries);


  const filteredEmployees = mergedSalaryList.filter(employee => {
    return employee.employeeId.m_code.toLowerCase().includes(searchTerm.toLowerCase())

  });


  // if (loading) return <p>Chargement des données...</p>;
  if (error) return <p>{error}</p>;

  const availableYears = [...new Set(salaryEmployees.map(emp => emp.year))].sort();

  // Générer les colonnes mois/année dans l'ordre souhaité
  const sortedColumns = [];
  availableYears.forEach((year, index) => {
    if (index > 0 && !sortedColumns.some(col => col.month === "Décembre" && col.year === year - 1)) {
      sortedColumns.push({ month: "Décembre", year: year - 1 });
    }

    months.forEach((month) => {
      sortedColumns.push({ month, year });
    });
  });

  const filteredColumns = sortedColumns.filter(({ month, year }) => {
    const monthIndex = months.indexOf(month) + 1; // Convertir le nom du mois en index (1-12)
    const startDate = startYear * 12 + startMonth;
    const endDate = endYear * 12 + endMonth;
    const currentDate = year * 12 + monthIndex;

    return currentDate >= startDate && currentDate <= endDate;
  });


  return (
    <div className="salary-manager">
      <h1>Gestion des Salaires</h1>

      <form onSubmit={handleAddEmployeeSalary} className="add-employee-form">
        <CFormSelect aria-label="Sélectionner un employée"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className='select-employee'
        >
          <option>Sélectionner un employé</option>
          {employees.map((employee, index) => (
            <option key={index} value={employee._id}>{employee.m_code} ({employee.usuel})</option>
          ))}
        </CFormSelect>
        <CFormInput
          type="text"  // Changer en "text" pour bien afficher les espaces
          placeholder="Salaire de base"
          className="select-employee"
          value={Number(monthlySalaries).toLocaleString('fr-FR')} // Affichage formaté
          onChange={(e) => {
            let rawValue = e.target.value.replace(/\s+/g, ''); // Supprime les espaces
            setMonthlySalaries(rawValue); // Stocke la valeur brute
          }}
          style={{
            textAlign: 'right',
            padding: '5px',
            fontSize: '16px',
            // fontWeight: 'bold'
          }}
        />

        <CFormSelect
          aria-label="Sélectionner un mois"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className='select-month'
        >
          <option value="">Sélectionner un mois</option>
          {months.map((month, index) => (
            <option key={index} value={index + 1}>{month}</option>
          ))}
        </CFormSelect>
        <CFormSelect
          aria-label="Sélectionner une année"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className='select-year'
        >
          {years.map((year, index) => (
            <option key={index} value={year}>{year}</option>
          ))}
        </CFormSelect>

        <CButton className='add-employee' type="submit">
          <CIcon icon={cilLibraryAdd} />
        </CButton>
      </form>

      <div className='container'>

        <div className="search-form">
          <CFormInput
            type="text"
            placeholder="Rechercher un employé"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
          />

          <div className="date-selects">
            <div className="date-group">
              <CFormSelect 
              className="select selectMonth"
              value={startMonth}
              onChange={(e) => setStartMonth(parseInt(e.target.value))}>
                {months.map((month, index) => (
                  <option key={`start-month-${index}`} value={index + 1}>
                    {month}
                  </option>
                ))}
              </CFormSelect>

              <CFormSelect 
                value={startYear}
                onChange={(e) => setStartYear(parseInt(e.target.value))}
                className="select selectYear"
              >
                {years.map(year => (
                  <option key={`start-year-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </CFormSelect>
            </div>
            
            <span>à</span>
            <div className="date-group">
              <CFormSelect 
                value={endMonth}
                onChange={(e) => setEndMonth(parseInt(e.target.value))}
                className="select selectMonth"
              >
                {months.map((month, index) => (
                  <option key={`end-month-${index}`} value={index + 1}>
                    {month}
                  </option>
                ))}
              </CFormSelect>

              <CFormSelect 
                className="select selectYear"
                value={endYear}
                onChange={(e) => setEndYear(parseInt(e.target.value))}
              >
                {years.map(year => (
                  <option key={`end-year-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </CFormSelect>
            </div>
          </div>

          <div className="file-input-form">

            <input
              type="file"
              className="file-input"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
            />
            <CButton className='add-employee' onClick={handleUpload}>
              <CIcon icon={cilCloudUpload} />
            </CButton>
          </div>
        </div>
      </div>
      <div className="salary-list-container">
      {
        (loading)? <p>Chargement des données...</p> : 
          <table className="salary-list-table">
            <thead>
              <tr>
                <th>Employé</th>
                {filteredColumns.map(({ month, year }, index) => (
                  <th key={index}>{month} {year}</th>
                ))}
                <th>Total Annuel</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(employee => {
                let totalAnnuel = filteredColumns.reduce((total, { month, year }) => {
                  let key = `${months.indexOf(month) + 1}-${year}`;
                  return total + (employee.monthlySalaries[key] || 0);
                }, 0).toLocaleString('fr-FR');
  
                return (
                  <tr key={employee.employeeId._id}>
                    <td>{employee.employeeId.m_code}</td>
                    {filteredColumns.map(({ month, year }, index) => {
                      let key = `${months.indexOf(month) + 1}-${year}`;
                      // Trouver le bon mois dans les salaires de l'employé
                      let salaryValue = employee.monthlySalaries[key] || 0;
  
                      return (
                        <td key={index}>
                          <input
                            type="text"
                            value={salaryValue ? salaryValue.toLocaleString('fr-FR') : ''}
                            onChange={(e) => {
                              let rawValue = e.target.value.replace(/\s+/g, '');
                              handleSalaryUpdate(employee.employeeId._id, months.indexOf(month) + 1, year, rawValue);
                            }}
                            style={{
                              textAlign: 'right',
                              padding: '5px',
                              fontSize: '16px',
                            }}
                          />
                        </td>
                      );
                    })}
                    <td className='total'>{totalAnnuel} AR</td>
  
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteEmployee(employee.employeeId._id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
  
                )
              })}
            </tbody>
          </table>
      }
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;