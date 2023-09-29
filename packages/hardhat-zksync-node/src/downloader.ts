import path from "path";
import fs from "fs";
import fse from 'fs-extra';
import { download } from "./utils";
import { ZkSyncNodePluginError } from "./errors";
import { PLUGIN_NAME } from "./constants";

export class RPCServerDownloader {
    private readonly _binaryDir: string;
    private readonly _version: string;

    constructor(binaryDir: string, version: string) {
        this._binaryDir = binaryDir;
        this._version = version;
    }

    public async isDownloaded(): Promise<boolean> {
        return fs.existsSync(this.getBinaryPath());
    }

    public async download(url: string): Promise<void> {
        try {
            await download(url, this.getBinaryPath(), PLUGIN_NAME, this._version, 30000);
            await this._postProcessDownload();
        } catch (error: any) {
            throw new ZkSyncNodePluginError(`Error downloading binary from URL ${url}: ${error.message}`);
        }
    }

    public getBinaryPath(): string {
        return path.join(this._binaryDir, this._version);
    }

    private async _postProcessDownload(): Promise<void> {
        const binaryPath = this.getBinaryPath();
        fse.chmodSync(binaryPath, 0o755);
    }
}