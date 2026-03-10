import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Login } from './pages/Login';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { AuthorityDashboard } from './pages/AuthorityDashboard';
import { ReportAccident } from './pages/ReportAccident';
import { ReportViolation } from './pages/ReportViolation';
import { Rewards } from './pages/Rewards';
import { Profile } from './pages/Profile';
import { Examples } from './pages/Examples';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Login },
      { path: 'citizen-dashboard', Component: CitizenDashboard },
      { path: 'authority-dashboard', Component: AuthorityDashboard },
      { path: 'report-accident', Component: ReportAccident },
      { path: 'report-violation', Component: ReportViolation },
      { path: 'rewards', Component: Rewards },
      { path: 'profile', Component: Profile },
      { path: 'examples', Component: Examples },
    ],
  },
]);
