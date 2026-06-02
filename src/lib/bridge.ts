import type { InvokeArgs, InvokeOptions } from "@tauri-apps/api/core";
import { invoke } from "@tauri-apps/api/core";

export type BridgeResponse<T> = ErrorResponse | SuccessResponse<T>;

export type ErrorResponse = {
    message: string;
};

export type SuccessResponse<T> = {
    value: T | undefined;
};

export function isErrorResponse<T>(response: BridgeResponse<T>): response is ErrorResponse {
    return (response as ErrorResponse).message !== undefined;
}

export function isSuccessResponse<T>(response: BridgeResponse<T>): response is SuccessResponse<T> {
    return (response as SuccessResponse<T>).value !== undefined;
}

export async function invokeBridge<T>(
    cmd: string,
    args?: InvokeArgs,
    options?: InvokeOptions
): Promise<SuccessResponse<T>> {
    return invoke<T>(cmd, args, options)
        .then((value: T) => ({ ...value } as SuccessResponse<T>))
        .catch((error: any) => {
            let message = "An unknown error has occurred.";

            if (error && typeof error === "object" && "message" in error) {
                message = String(error.message);
            } else if (typeof error === "string") {
                message = error;
            }

            throw { message } as ErrorResponse;
        });
}