export class ApiError {
  constructor(
    public message: string, 
    public statusCode: number
  ) { }
}
