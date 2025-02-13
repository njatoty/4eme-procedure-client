import { CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CContainer, CFormInput, CFormLabel, CRow } from '@coreui/react';
import React, { useEffect, useMemo, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './../../../assets/css/heures-travail.css'
import FPOptionService from '../../../services/fp-option-service';
import { CheckCheck, Save } from 'lucide-react';

const filterItems = (items, searchText) => {
  return items.filter(item =>
    item.m_code.toLowerCase().includes(searchText.toLowerCase())
  );
};

function highlightSearch(text, searchTerm) {
  // Escape special characters in the search term for safe regex
  const escapedSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  // Create a regex with the escaped term, case-insensitive
  const regex = new RegExp(escapedSearchTerm, 'gi');

  // Replace the found term with wrapped HTML
  return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
}

const DroppableComponent = ({ droppableId, items, searchText, setItems }) => {
  
  const dataItems = useMemo(() => filterItems(items, searchText), [items, searchText]);

  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef} style={{ flexGrow: 1 }}>
          {
            dataItems.length === 0 ? (
              <div className="empty-list text-secondary">Aucun élément trouvé</div>
            ) : (
              dataItems.map((item, index) => (
                <Draggable key={item.id || item._id} draggableId={item.id || item._id} index={index}>
                  {(provided) => (
                    <CCard
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className={`draggable-item ${droppableId} p-2 d-block me-2 mb-2 ${item.isNew ? 'new' : ''}`}
                      dangerouslySetInnerHTML={{ __html: highlightSearch(
                        `${item.m_code} *** ${item.usuel} `, searchText
                      ) }}
                    />
                  )}
                </Draggable>
              ))
            )
          }
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
};

const HeureTravailForm = () => {
  const [searchSix, setSearchSix] = useState('');
  const [searchEight, setSearchEight] = useState('');
  const [tauxHoraire6H, setTauxHoraire6H] = useState('164.54');
  const [tauxHoraire8H, setTauxHoraire8H] = useState('173.33');
  const [agentsPointage, setAgentsPointage] = useState([]);
  const [agentsFP, setAgentsFP] = useState([]);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [messageBox, setMessageBox] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showMessageBox = (type, message) => {
    setMessageBox({ show: true, type, message });
    setTimeout(() => {
      setMessageBox({ show: false, type, message: "" });
    }, 5000);
  };

  const [items6H, setItems6H] = useState([]);
  const [items8H, setItems8H] = useState([]);


  const newAgents = useMemo(() =>
    agentsPointage.filter(a => !agentsFP.map(af => af.m_code)
                  .includes(a.m_code))
                  .map(a => ({ ...a, isNew: true })),
  [agentsPointage, agentsFP]);

  const refetchData = async () => {
    try {
      setRefreshing(true);
      // fetch heures travails in FPOption
      FPOptionService.getOption().then(data => {
        if (Array.isArray(data.heuresTravails)) {
          setAgentsFP(data.heuresTravails);
          setTauxHoraire6H(data.tauxHoraires6H);
          setTauxHoraire8H(data.tauxHoraires8H);
        }
      });
      // fetch user pointage
      FPOptionService.getAgents().then(data => {
        // return setAgentsPointage(data);
        // setAgentsPointage([
        //   { m_code: "M-NAT", user_ht: 8, id: "100" },
        //   { m_code: "M-VAN", user_ht: 6, id: "101" },
        //   { m_code: "M-CLA", user_ht: 6, id: "102" },
        //   { m_code: "M-NA", user_ht: 8, id: "103" },
        // ]);
      });
    } catch (err) {
      console.log(err)
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    refetchData();
  }, []);

  useEffect(() => {

    const combined = [...agentsFP, ...newAgents]
    // const sortByM_code = (a, b) => a.m_code.localeCompare(b.m_code);
    setItems6H(combined.filter(agent => agent.user_ht === 6).sort());
    setItems8H(combined.filter(agent => agent.user_ht === 8).sort());
    
  }, [agentsFP, newAgents]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceList = result.source.droppableId === 'six-h' ? items6H : items8H;
    const destList = result.destination.droppableId === 'six-h' ? items6H : items8H;

    const [removed] = sourceList.splice(result.source.index, 1);
    destList.splice(result.destination.index, 0, removed);

    if (result.source.droppableId === 'six-h') {
      setItems6H([...sourceList]);
      if (result.destination.droppableId === 'eight-h') {
        setItems8H([...destList]);
      }
    } else {
      setItems8H([...sourceList]);
      if (result.destination.droppableId === 'six-h') {
        setItems6H([...destList]);
      }
    }

    // update
    setTimeout(() => {

      let data1 = items6H.map(i => ({ ...i, user_ht: 6 }));
      let data2 = items8H.map(i => ({ ...i, user_ht: 8 }));

      setItems6H(data1);
      setItems8H(data2);

    }, 50);

  };

  // handle save
  async function save() {
    try {

      setSaving(true);
      const data = await FPOptionService.updateHeuresTravails({
        heuresTravails: [...items6H, ...items8H],
        tauxHoraires6H: parseFloat(tauxHoraire6H),
        tauxHoraires8H: parseFloat(tauxHoraire8H)
      });
      setAgentsFP(data.heuresTravails);
      showMessageBox('success', 'Données enregistrées avec succès!');

    } catch (error) {
      console.error(error);
      showMessageBox('success', error?.message || error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="app-header d-none">
        <CContainer>
          <h3 className="text-center mb-0">Tableau de Gestion du Travail</h3>
          <p className="text-center mb-0 mt-2 text-light">Organisez et gérez votre travail efficacement</p>
        </CContainer>
      </div>

      <CContainer>
        <CRow>
          <CCol md={10}>
            <CAlert color="info" className="d-flex align-items-center mb-4">
              <div>
                💡 <strong>Astuce :</strong> Faites glisser et déposez les M-CODES entre les colonnes
              </div>
            </CAlert>
          </CCol>
          <CCol md={2}>
            <CButton onClick={refetchData} disabled={refreshing} color="primary" className="mb-4 mx-auto">
              {refreshing ? "Rafraîchir..." : "Rafraîchir"}
            </CButton>
          </CCol>
        </CRow>


        <DragDropContext onDragEnd={handleDragEnd}>
          <CRow>
            <CCol md={6}>
              <CCard className="mb-4">
                <CCardHeader className="column-header d-flex justify-content-between align-items-center">
                  <div className='d-flex align-items-center'>
                    <h5 className="mb-0">Travail de 6 heures
                    </h5>
                    <span className="task-count">{items6H.length}</span>
                  </div>
                </CCardHeader>
                <CCardBody>
                  <CRow className='mb-2'>
                    <CCol md={6}>
                      <CFormLabel>Taux horaires:</CFormLabel>
                      <CFormInput
                        type="number"
                        placeholder="0.00"
                        value={tauxHoraire6H}
                        onChange={(e) => setTauxHoraire6H(e.target.value)}
                        className="search-box"
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel className='opacity-0'>Chercher</CFormLabel>
                      <CFormInput
                        type="search"
                        placeholder="Chercher M-CODE..."
                        value={searchSix}
                        onChange={(e) => setSearchSix(e.target.value)}
                        className="search-box"
                      />
                    </CCol>
                  </CRow>

                  <div className="column-container">
                    <DroppableComponent
                      droppableId={'six-h'}
                      items={items6H}
                      searchText={searchSix}
                      setItems={setItems6H}
                    />
                  </div>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol md={6}>
              <CCard className="mb-4">
                <CCardHeader className="column-header d-flex justify-content-between align-items-center">
                <div className='d-flex align-items-center'>
                    <h5 className="mb-0">Travail de 8 heures
                    </h5>
                    <span className="task-count">{items8H.length}</span>
                  </div>
                </CCardHeader>
                <CCardBody>
                  <CRow className='mb-2'>
                    <CCol md={6}>
                      <CFormLabel>Taux horaires:</CFormLabel>
                      <CFormInput
                        type="number"
                        placeholder="0.00"
                        value={tauxHoraire8H}
                        onChange={(e) => setTauxHoraire8H(e.target.value)}
                        className="search-box"
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel className='opacity-0'>Chercher</CFormLabel>
                      <CFormInput
                        type="search"
                        placeholder="Chercher M-CODE..."
                        value={searchEight}
                        onChange={(e) => setSearchEight(e.target.value)}
                        className="search-box"
                      />
                    </CCol>
                  </CRow>
                  <div className="column-container">

                    <DroppableComponent
                      droppableId={'eight-h'}
                      items={items8H}
                      searchText={searchEight}
                      setItems={setItems8H}
                    />

                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </DragDropContext>

        <CRow style={{ marginBlock: "1rem" }}>
          <CCol sm={6}>
                <CButton
                  color="success"
                  className="d-flex align-items-center gap-2 text-white"
                  onClick={save}
                  disabled={saving}
                >
                  {saving ? (
                    <span>Enregistrement en cours...</span>
                  ) : (
                    <>
                      <Save size={18} />
                      Enregistrer
                    </>
                  )}
                </CButton>
          </CCol>
          <CCol md={6} className="mb-2">
            {messageBox.show && (
              <CAlert
                color={messageBox.type}
                className="d-flex align-items-center gap-2"
              >
                <CheckCheck size={18} /> {messageBox.message}
              </CAlert>
            )}
          </CCol>
        </CRow>

      </CContainer>
    </>
  );
}

export default HeureTravailForm
