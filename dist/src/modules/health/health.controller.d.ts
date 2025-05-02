import { PrismaService } from '../../common/prisma.module';
export declare class HealthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
