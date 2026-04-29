export interface process_parameters {
    name: string;
    filePath: string;
    length: number;
    downloaded: number;
    uploaded: number;
    description: string;
    visibility: "public" | "private" | "unlisted";
    categoryId: string;
    tags: string[];
    status: "downloading" | "uploading" | "done" | "failed";
}
