import { Machine } from "./model/Machine";
import { IEvent, MachineRefillEvent, MachineSaleEvent } from "./service/Event";
import { IPublishSubscribeService, PublishSubscribeService } from "./service/pubsub/PublishSubscribeService";
import { MachineRefillSubscriber, MachineSaleSubscriber, StockWarningSubscriber } from "./service/pubsub/Subscriber";


// helpers
const randomMachine = (): string => {
  const random = Math.random() * 3;
  if (random < 1) {
    return '001';
  } else if (random < 2) {
    return '002';
  }
  return '003';

}

const eventGenerator = (): IEvent => {
  const random = Math.random();
  if (random < 0.5) {
    const saleQty = Math.random() < 0.5 ? 1 : 2; // 1 or 2
    return new MachineSaleEvent(saleQty, randomMachine());
  } 
  const refillQty = Math.random() < 0.5 ? 3 : 5; // 3 or 5
  return new MachineRefillEvent(refillQty, randomMachine());
}


// program
(async () => {
  // create 3 machines with a quantity of 10 stock
  const machines: Machine[] = [ new Machine('000'), new Machine('001'), new Machine('002'), new Machine('003') ];

  // create a machine sale event subscriber. inject the machines (all subscribers should do this)
  const saleSubscriber = new MachineSaleSubscriber(machines);
  const refillSubscriber = new MachineRefillSubscriber(machines);
  const stockWarningSubscriber = new StockWarningSubscriber(machines);

  // create the PubSub service
  // const pubSubService: IPublishSubscribeService = null as unknown as IPublishSubscribeService; // implement and fix this
  const pubSubService: IPublishSubscribeService = new PublishSubscribeService(machines);
  pubSubService.subscribe(saleSubscriber);
  pubSubService.subscribe(refillSubscriber);
  pubSubService.subscribe(stockWarningSubscriber);

  // create 5 random events
  const events = [1,2,3,4,5].map(i => eventGenerator());
  events.forEach(event => {
    // if (event instanceof MachineSaleEvent) {
    //   pubSubService.subscribe(event.type(), saleSubscriber);
    // } else if (event instanceof MachineRefillEvent) {
    //   pubSubService.subscribe(event.type(), refillSubscriber);
    // }
    // pubSubService.subscribe(event.type(), stockWarningSubscriber);

    
  })

  // publish the events
  events.map(pubSubService.publish);
})();