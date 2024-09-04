export default function korTime():Date {
    const now = new Date();
    const utcOffset = 9 * 60 * 60 * 1000; // UTC+9 시간대 오프셋 (밀리초 단위)

    // 현재 UTC 시간에 UTC+9 오프셋을 더하여 원하는 시간대의 시각 계산
    const utcPlus9 = new Date(now.getTime() + utcOffset);

    return utcPlus9;
}
