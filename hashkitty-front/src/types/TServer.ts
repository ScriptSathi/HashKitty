export type THashcatPartialStatus = {
    session: string;
    guess: {
        [key: string]: string | number | null | boolean;
    };
    status: number;
    target: string;
    progress: number[];
    restore_point: number;
    recovered_hashes: number[];
    recovered_salts: number[];
    rejected: number;
    devices: {
        device_id: number;
        device_name: string;
        device_type: string;
        speed: number;
        temp: number;
        util: number;
    }[];
    time_start: number;
    estimated_stop: number;
};

export type THashcatStatus = {
    isRunning: boolean;
} & Partial<THashcatPartialStatus>;
