import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import EventsMap from '../components/dashboard components/EventsMap'
import ErrorBoundary from '../containers/ErrorBoundaries'
import SessionByDays from "components/dashboard components/SessionByDays";
import SessionByHours from "components/dashboard components/SessionByHours";
import EventsLog from "components/dashboard components/EventsLog";
import RetentionLog from "components/dashboard components/RetentionLog";
import { AdminCard } from "components/styled components/admin.styles";
import EventsByOs from "components/dashboard components/EventByOs";
import PageViews from "components/dashboard components/PageViews";


export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}


const DashBoard: React.FC = () => {

  return (
      <AdminCard>
        <ErrorBoundary>
          <EventsMap/>
        </ErrorBoundary>
        <ErrorBoundary>
          <SessionByDays/>
        </ErrorBoundary>
        <ErrorBoundary>
          <SessionByHours/>
        </ErrorBoundary>
        <ErrorBoundary>
          <EventsByOs/>
        </ErrorBoundary>
        <ErrorBoundary>
          <PageViews/>
        </ErrorBoundary>
        <ErrorBoundary>
          <RetentionLog/>
        </ErrorBoundary>
        <ErrorBoundary>
          <EventsLog/>
        </ErrorBoundary>
      </AdminCard>
  );
};

export default DashBoard;
