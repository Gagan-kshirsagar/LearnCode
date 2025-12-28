export const formatMemory = (memory: any) => {
  if (!memory) return "N/A";
  try {
    const memoryArray = JSON.parse(memory);
    const avgMemory =
      memoryArray.reduce(
        (a: string, b: string) => parseFloat(a) + parseFloat(b),
        0
      ) / memoryArray.length;
    return `${avgMemory.toFixed(2)} KB`;
  } catch (e) {
    return "N/A";
  }
};

export const formatTime = (time: any) => {
  if (!time) return "N/A";
  try {
    const timeArray = JSON.parse(time);
    const avgTime =
      timeArray
        ?.map((t: string) => parseFloat(t.replace(" s", "")))
        .reduce((a: number, b: number) => a + b, 0) / timeArray.length;
    return `${avgTime.toFixed(3)} s`;
  } catch (e) {
    return "N/A";
  }
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
