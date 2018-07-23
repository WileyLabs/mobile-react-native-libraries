import { watchStatus } from './trackStatus';
import { watchNavigation } from './navigateRequest';
import { watchInitRequest } from './initRequest';

export default function* accessibilitySaga() {
  yield [
    watchStatus(),
    watchNavigation(),
    watchInitRequest()
  ];
}
