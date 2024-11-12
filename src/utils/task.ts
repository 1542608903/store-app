export const taskQueue = (...tasks: Array<() => Promise<void>>) => {
  return new Promise<void>((resolve, reject) => {
    const runTask = (index: number) => {
      if (index >= tasks.length) {
        // 当所有任务完成时，resolve 结束
        return resolve();
      }

      // 执行当前任务，并确保它返回一个 Promise
      const task = tasks[index];

      try {
        // 确保任务是 Promise，任务执行完成后递归调用下一个任务
        Promise.resolve(task())
          .then(() => {
            runTask(index + 1);
          })
          .catch(reject); // 捕获错误并结束
      } catch (error) {
        reject(error); // 捕获同步错误
      }
    };
    // 从第一个任务开始
    runTask(0);
  });
};
