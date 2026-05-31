class TimeUtils {
    static stringToMinutes(timeStr: string): number | undefined {
        if (!timeStr) {
            return undefined;
        }

        const [hours, minutes] = timeStr.split(":").map(Number);
        
        return hours * 60 + minutes;
    }
}

export default TimeUtils;