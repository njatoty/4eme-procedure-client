import React, { useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
} from '@coreui/react'
import EtatDePaie from './component/etat-paie'
import IRSADuForm from './component/irsa'

const MenuTabs = () => {


  const [activeKey, setActiveKey] = useState(() => {
    // Retrieve the last active key from localStorage or set default
    return localStorage.getItem('activeTabKey') || 'etat-paie';
  });


  useEffect(() => {
    // Save the active key to localStorage whenever it changes
    localStorage.setItem('activeTabKey', activeKey);
  }, [activeKey]);

  return (
    <CRow>
      <CCol xs={12}>
        <CTabs activeItemKey={activeKey} onClick={alert}>
          <CTabList variant="underline-border">
            <CTab itemKey="etat-paie" onClick={() => setActiveKey('etat-paie')}>Configuration - Etat de paie</CTab>
            <CTab itemKey="irsa" onClick={() => setActiveKey('irsa')}>Calcul IRSA</CTab>
          </CTabList>
          <CTabContent>
            <CTabPanel className="p-3" itemKey="etat-paie">
              <EtatDePaie />
            </CTabPanel>
            <CTabPanel className="p-3" itemKey="irsa">
              <IRSADuForm />
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </CCol>
    </CRow>
  )
}

export default MenuTabs
