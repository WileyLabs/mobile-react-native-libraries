import { watchStatus } from './trackStatus';
import { watchNavigation } from './navigateRequest';
import { watchInitRequest } from './initRequest';

// Root accessibility saga
export default function* accessibilitySaga() {
  yield [
    watchStatus(),
    watchNavigation(),
    watchInitRequest()
  ];
}
