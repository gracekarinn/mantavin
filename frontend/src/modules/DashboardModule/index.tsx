import React from 'react';
import { OverviewPageSection } from './sections/OverviewPageSection';
import { EmployeesPageSection } from './sections/EmployeesPageSection';
import { ProofOfWorkSection } from './sections/ProofOfWorkSection';

export const OverviewPageModule = () => {
    return <OverviewPageSection />;
}

export const EmployeesPageModule = () => {
    return <EmployeesPageSection />;
}

export const ProofOfWorkPageModule = () => {
    return <ProofOfWorkSection />;
}
