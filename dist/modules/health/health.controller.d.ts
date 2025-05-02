export declare class HealthController {
    private prisma;
    check(): Promise<{
        status: string;
        db: string;
        error?: undefined;
    } | {
        status: string;
        db: string;
        error: any;
    }>;
}
