export class TimeUtils {
    static hoursToMinutes = (hours) => hours * 60;
    static minutesToSeconds = (minutes) => minutes * 60;
    static secondsToMilliSeconds = (seconds) => seconds * 1000;
    static hoursToMilliSeconds = (hours) =>
        TimeUtils.secondsToMilliSeconds(
            TimeUtils.minutesToSeconds(TimeUtils.hoursToMinutes(hours))
        );
}
