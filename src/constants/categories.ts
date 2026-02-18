export const EVENT_CATEGORIES = [
    'MARKET',
    'FESTIVAL',
    'CONFERENCE',
    'EXPO',
    'OTHER'
] as const;

export type EventCategory = typeof EVENT_CATEGORIES[number];
