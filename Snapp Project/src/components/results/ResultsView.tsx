import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../transitions/PageTransition';
import ResultsContainer from './ResultsContainer';

const ResultsView: React.FC = () => {
  return (
    <PageTransition>
      <ResultsContainer />
    </PageTransition>
  );
};

export default ResultsView;