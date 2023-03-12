const timeout = (timeout: number = 3, isSuccess: boolean = true) => new Promise<void>((resolve, reject) => {
    setTimeout(() => {
        if (isSuccess) {
            resolve();
        } else {
            reject();
        }
    }, timeout * 1000);
});

export default timeout;