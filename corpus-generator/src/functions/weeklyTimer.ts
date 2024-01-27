import { app, InvocationContext, Timer } from "@azure/functions";

export async function weeklyTimer(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('Timer function processed request.');
}

app.timer('weeklyTimer', {
    schedule: '0 0 0 * * 1',
    handler: weeklyTimer
});
