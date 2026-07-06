import { AppErrorPage } from '../pages/ErrorPage';

export default function NotFoundRoute() {
  return <AppErrorPage variant="not-found" statusCode={404} />;
}
