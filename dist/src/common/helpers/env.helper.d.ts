export declare class EnvHelper {
    static get(key: string, fallback?: string): string;
    static int(key: string, fallback?: number): number;
    static bool(key: string, fallback?: boolean): boolean;
}
