import { Request, Response } from 'express';
import { Hashcat } from '../hashcat/Hashcat';

export class RouteHandler {
    public hashcat: Hashcat = new Hashcat();

    public execHashcat = (req: Request, res: Response) => {
        this.hashcat.exec(req.body);
        try {
            res.status(200).json({
                status: 'Hashcat has start',
            });
        } catch (err) {
            res.status(200).json({
                status: 'An error occurred during the execution of hashcat',
            });
        }
    };

    public restoreHashcat = (req: Request, res: Response) => {
        try {
            this.hashcat.restore(req.body);
            res.status(200).json({
                status: 'Hashcat has been restored',
            });
        } catch (err) {
            res.status(200).json({
                status: 'An error occurred during the execution of hashcat',
            });
        }
    };

    public getHashcatStatus = (_: Request, res: Response) => {
        if (this.hashcat.status && this.hashcat.status.isRunning) {
            res.status(200).send({
                status: this.hashcat.status,
            });
        } else {
            res.status(200).json({
                status: 'Hashcat is not running',
            });
        }
    };

    public getStopHashcat = (_: Request, res: Response) => {
        if (this.hashcat.status && this.hashcat.status.isRunning) {
            this.hashcat.stop();
            res.status(200).json({
                status: 'Hashcat has been stopped',
            });
        } else {
            res.status(200).json({
                status: 'Hashcat is not running',
            });
        }
    };
}
