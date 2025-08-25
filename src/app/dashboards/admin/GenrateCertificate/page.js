'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  Paper,
} from '@mui/material';
import CertificateGenerator from '../../../../components/admin/CertificateGenerator';
import CertificateStats from '../../../../components/admin/CertificateStats';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`certificate-tabpanel-${index}`}
      aria-labelledby={`certificate-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `certificate-tab-${index}`,
    'aria-controls': `certificate-tabpanel-${index}`,
  };
}

const CertificateDashboard = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Certificate Management
      </Typography>
      
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="certificate management tabs"
            variant="fullWidth"
          >
            <Tab label="Generate Certificates" {...a11yProps(0)} />
            <Tab label="Statistics & Analytics" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <CertificateGenerator />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <CertificateStats />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default CertificateDashboard;
