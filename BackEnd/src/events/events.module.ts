import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { eventsConfig } from '../config/events.config';
import { EventAuditListener } from './listeners/event-audit.listener';
import { UserListener } from './listeners/user.listener';
import { QuestListener } from './listeners/quest.listener';
import { PayoutListener } from './listeners/payout.listener';
import { SubmissionListener } from './listeners/submission.listener';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot(eventsConfig)],
  providers: [
    EventStoreService,
    EventPersistenceListener,
    DeadLetterQueueListener,
    EventAuditListener,
    UserListener,
    QuestListener,
    PayoutListener,
    SubmissionListener,
    EventStoreService,
    QuestEventsHandler,
    UserEventsHandler,
    SubmissionEventsHandler,
    DeadLetterHandler,
  ],
  exports: [EventEmitterModule, EventStoreService],
})
export class EventsModule {}
