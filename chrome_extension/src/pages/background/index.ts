import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
reloadOnUpdate("pages/background");
console.log("background@12345678 ");
import { createMachine, interpret } from 'xstate';
import { fromEvent } from 'rxjs';
import { from } from "rxjs";
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { mapValues } from "xstate/lib/utils";
interface ExternalMessage{
  message: any;
  sender: any;
  sendResponse: any;
}
const date=new Date();
  const t=date.getMilliseconds();
async function fetchdata(context,event) {
  const { message, sender, sendResponse } = context.externalMessage[0];
  context.externalMessage.shift();
  async function fetchdatainner(){
  
    try {
      const response = await fetch(message.link, {
        method: 'GET',
      });   
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.log("error1 bro", error);
      return undefined;
    }
  
}
async function fetchDataAndSendResponse() {
  try {
    const ip1 = await fetchdatainner();
    //console.log("inside services",ip1.ip)
    if(typeof ip1!=='undefined'){
      sendResponse(`${ip1.ip},,and time is ${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()},,${message.i}`);
    }
    else{
      sendResponse(`error in fetching ,,,and time is ${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`);
    }
  } catch (error) {
    console.log("error2 bro", error);
  }
}
await fetchDataAndSendResponse();
}
const serviceWorkerMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SzAJwG4EsDGYDqA9qgNZoDEAKgKIBKAsgJIByAgtQNoAMAuoqAA4FYmAC6YCAOz4gAHogDMADkUA6TgBYA7J00BOAIzqAbPP0BWAEzqANCACeifRYC+z2ygw58RUqhWowKExYETRIMmYAZQoWABlYrl4kEEFhMUlpOQQLfSMVE31OIzNDM3V1fXlbBwR5dU583XkdTVyjTn1NTVd3NCxcQhI0FUwJEIBDABtJ8JYAYQoGADU2KkTpVNFxKWSsyzM1Fs0jdWbOK01qhXrG5q62jq6ekA9+7yG-cewxdHHQiDIVAAGtQaKxYgB9OhUSKRFgAcTWPA2Qi2GV2iDMdRUxl0ZjxigqFg6ZiuCE6mhUihMmiUZkUmgZykUz1eXkGvhU-FQBFwsGEEigZAgkjAIwk6AIpBUbIGPmG3N5cAFUAQo0l2D+20S62Sm3SO1AWXkZga7XUZj0FhKugtGjJlTyeMqDLMpvkFiMTVZfXZ8r8ir5KrI0NhCKoEIACjQAPJzGGRKgAEV1AlRBsymOthy6x1OnHOWjJFk06nyFia+MU8jq6gM6lcbhAEgIEDg0ll718KLS20zCAAtPoyXWccVWkpq4ozEZq0YfZ45R9-IFgqEAhAe2jDbJELaVE4LUZ9LoTso6pd7Nd9AfFBYLPJdLS750zAu3hzhqMJtNIFuMxitSaBYt76J01ZOEYjIMmSdQ3vod45MUuicKYJrvn6y5fD8fx-nq6Z9oBmglCoJS5HeFGtLosGmKR7SPtaWImqYb5Np2n4BjyQajFA-6EUaCgmqRZRGEY96cKa7TWsWQnAfenSlKaM4YUunLrgAtqMWrommvY6buCBFle2SKA0J4GB68izrkHqNs4QA */
  id: 'serviceWorker',
  initial: 'registered',
  context: {
    externalMessage:[],
  },
  on: {
    TERMINATE: "termination"
  },
  states: {
    registered: {
      on: {
        INSTALL: 'installed',
      },
    },
    installed: {
      on: {
        ACTIVATE:'activated'
      },
    },
    activated: {
      entry:(context,event)=>{
        externalMessageSubject.subscribe(({ message, sender, sendResponse }) => {
          console.log(`inside entry,activated,hot observable:--->${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`,message);
          context.externalMessage.push({message, sender, sendResponse});
          if(serviceWorkerService.state.matches('activated')){
          serviceWorkerService.send({ type: 'EXTERNAL_MESSAGE', message, sender, sendResponse });
          }
        }); 
      },
      on:{
          EXTERNAL_MESSAGE: {
            target: 'processing',
            actions:(context,event)=>{
              console.log(`inside xstate activated state:--->${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`,event.message); 
            }  
        },
      }
      
    },
    processing: {
      on:{
        EXTERNAL_MESSAGE: {
          target: 'processing',
          actions:(context,event)=>{
            console.log(`inside xstate processing state:--->${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()} and req no is -->`,context.externalMessage[0].message.i); 
          }  
      },
        ACTIVATE:{
          target:'activated',
        }
    },
      invoke: {
        src: 'fetchdata',
        onDone:{
          actions:(context,event)=>{
            
            console.log(`request processed and size of array now is ${context.externalMessage.length},,,`)
            if(context.externalMessage.length!==0){
              serviceWorkerService.send({ type: 'EXTERNAL_MESSAGE' });
            }
            else{
              console.log("now go to activate state");
              serviceWorkerService.send('ACTIVATE');
            }
          }
        }
      },
    },
    termination:{
      type: "final"
    }
  }},
   {
      services: {
         fetchdata, 
      },
   }
);

const serviceWorkerService = interpret(serviceWorkerMachine).start();
 serviceWorkerService.onTransition((state) => {
    console.log('Current State from xstate:', state.value);
    if(serviceWorkerService.state.matches('error')){
      console.log("error occured bro for the request.")
    }
   });
fromEvent(self, 'install').subscribe((event) => {
  //console.log(`service worker state now:---> ${event.type}`);
  serviceWorkerService.send('INSTALL');
});
fromEvent(self, 'activate').subscribe((event) => {
  //console.log(`service worker state now:---> ${event.type}`);
  serviceWorkerService.send('ACTIVATE');
});
const externalMessageSubject = new Subject<ExternalMessage>();

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  console.log(`inside chrome.runtime.onmessageExternal:--->${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`,message);
  externalMessageSubject.next({
    message,
    sender,
    sendResponse,
  });
});
chrome.runtime.onSuspend.addListener(() => {
 serviceWorkerService.send("TERMINATE")
 console.log("suspend now ")
});












