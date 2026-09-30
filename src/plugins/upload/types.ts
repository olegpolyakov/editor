export type UploadedAsset = {
    id: string;
    src: string;
    previewSrc: string;
    size: number;
    filename: string;
    contentType: string;
};

export type UploadStatus = {
    state: 'uploading' | 'done' | 'error';
    error?: string;
};

export interface Storage<T extends UploadedAsset = UploadedAsset> {
    upload(file: File): Promise<T>;
    delete(asset: T): Promise<void>;
}