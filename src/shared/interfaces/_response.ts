export interface IRespuesta<T> {
  success: boolean;
  data: T;
  message: string;
}
