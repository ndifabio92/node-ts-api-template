import { Request, Response } from "express";
import _dataContext from "../../data/postgress/dataContext";

export class HealthController {

    constructor() { }

    public checkDatabase = async (req: Request, res: Response) => {
        try {
            await _dataContext.$queryRaw`SELECT 1`;

            res.status(200).json({ status: 'success', message: 'Database is up and running' });
        } catch (error: any) {
            console.error('Database health check failed:', error);
            res.status(500).json({ status: 'error', message: 'Database is down', error: error.message });
        }
    }
}