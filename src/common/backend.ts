import PCancelable from 'p-cancelable'
import * as _ from 'lodash'
import { v4 as guid } from 'uuid'
import Cognito from 'authentication/cognito';

//Make backend calls
export default class Backend {

    static ConcurrentCallsLimit = 8
    static CallQueue: any[] = []
    static RunningCalls: any[] = []
    static EndPoint = 'https://api.thedogapi.com/v1/'

    static enforceQueue() {
        //If currently running less concurrent calls then a maximum allowed - add more
        if (Backend.RunningCalls.length < Backend.ConcurrentCallsLimit) {
            for (let i = 0; i < Backend.ConcurrentCallsLimit - Backend.RunningCalls.length; i++) {
                let nextCall = Backend.CallQueue.shift()
                if (nextCall) {
                    //push in line & run
                    Backend.RunningCalls.push(nextCall)
                    Backend.runCall(nextCall)
                }
            }
        }
    }

    static runCall(CallParams: any) {

        Cognito.getAccessToken()
            .then(() => {
                // Create an instance of abort controller for promise cancellation
                const abortController = new AbortController()
                const signal = abortController.signal

                fetch(CallParams.EndPoint + CallParams.ControllerMethod, {
                    method: CallParams.HttpMethod,
                    headers: { ...CallParams.Headers , 'x-api-key': '7ff07cb7-7c1b-4410-bf78-96ac927baa08' },
                    credentials: "same-origin",
                    body: CallParams.DataObject ? JSON.stringify(CallParams.DataObject) : null, //get requests cannot have body
                    signal: signal
                })
                    .then(response => {
                        //If 401-Unautorized was received, redirect to main page
                        //if (response.status === 401 && !history.location.pathname.includes('sign-in')) console.log('logout event'); //window.dispatchEvent(Events.zdLogout)
                        //if (response.status === 401 && !history.location.pathname.includes('/logout')) history.push('/logout')

                        //Update cookies that control automatic logout
                        //if (response.headers.has("TokenExpiration") && response.headers.has("CurrentServerTime")) {
                        //  let tokenExpiration = Date.parse(response.headers.get("TokenExpiration"))
                        //  let serverTime = Date.parse(response.headers.get("CurrentServerTime"))
                        //  let tokenExpiresIn = tokenExpiration - serverTime
                        //  cookies.set("loginTokenExp", Date.now() + tokenExpiresIn, { path: "/", expires: new Date((Date.now() + tokenExpiresIn)) })
                        //}

                        //Reject call if endpoint not found
                        if (response.status === 404) CallParams.Reject('Endpoint not found')

                        response.json()
                            .then(json => {
                                // if (json.Status.Code === 1074) {
                                //   //if ticket is invalid - redirect to login
                                //   if (json.Content === 'User Token Has Expired' && !history.location.pathname.includes('/sign-in')) {
                                //     console.log('push logout')
                                //     window.dispatchEvent(Events.zdLogout)
                                //   }

                                //   //Send Promise Reject Signal
                                //   CallParams.Reject(json.Content)
                                // }
                                // else if (json.Status.Code === 104) {
                                //Handle OK response
                                CallParams.Resolve(json)
                                //}
                            })
                            //Catch JSON Parse errors
                            .catch(error => {
                                //Send Promise Reject Signal
                                CallParams.Reject('Server Error (' + response.status + '): ' + error)
                            })
                    })
                    .catch(response => {
                        //Per MDN, the fetch() API only rejects a promise when a “network error is encountered, although this usually means permissions issues or similar.” 
                        console.log(response)
                        //Send Promise Reject Signal
                        CallParams.Reject("Network Error Encountered or request was cancelled");
                    })
                    .then(() => {
                        //remove call from the queue
                        _.remove(Backend.RunningCalls, call => call.CallID === CallParams.CallID);
                        Backend.enforceQueue();
                    });

                //If promise is cancelled
                CallParams.Cancel.shouldReject = false; //do no throw exception if promise is cancelled
                CallParams.Cancel(() => {
                    //Abort the fetch request
                    abortController.abort();
                    //And reject the promise
                    CallParams.Reject('Async request was canceled');
                });
            })
            .catch(CallParams.Reject);
    }

    static addCall<Type>(params: any, priorityCall = false) {
        //this promice will be returned to the original method caller
        let outsideResolve, outsideReject, outsideCancel;
        let returnPromise = new PCancelable<Type>((resolve, reject, onCancel) => { outsideResolve = resolve; outsideReject = reject; outsideCancel = onCancel })

        let CallParams = {
            //Generate unique callID
            CallID: guid(),

            EndPoint: Backend.EndPoint, //default endpoint
            HttpMethod: 'post',
            ControllerMethod: null,
            Headers: { 'Content-Type': 'application/json' },
            DataObject: null, //Data object for post request used in body of request

            Resolve: outsideResolve,
            Reject: outsideReject,
            Cancel: outsideCancel,

            ...params
        }

        //push call in a queue, if call is priority push in front of a queue
        priorityCall ? Backend.CallQueue.unshift(CallParams) : Backend.CallQueue.push(CallParams)

        //run queue
        Backend.enforceQueue()

        return returnPromise
    }

    static post<Type>(controllerMethod: string, dataObject = {}, priorityCall = false) {
        return this.addCall<Type>({
            ControllerMethod: controllerMethod,
            DataObject: dataObject,
            HttpMethod: 'post'
        }, priorityCall);
    }

    //get method cannot have any "body" payload therefore no data object here
    static get<Type>(controllerMethod: string, priorityCall = false) {
        return this.addCall<Type>({
            ControllerMethod: controllerMethod,
            HttpMethod: 'get'
        }, priorityCall)
    }
 }
