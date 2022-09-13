import { ExecuteActionArguments } from './execute-action-arguments';

export type ActionFn = (args: ExecuteActionArguments) => Promise<any>;