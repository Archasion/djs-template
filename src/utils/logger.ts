export default class Logger {
    static ready(message: string): void {
        console.log(`\x1b[32m[READY] ${message}\x1b[0m`);
    }
    static info(message: string): void {
        console.log(`\x1b[36m[INFO]\x1b[0m ${message}`);
    }
}