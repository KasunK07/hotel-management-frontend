export async function fetchMock<T>(data: T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 220));
  return data;
}
